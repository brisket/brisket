"use strict";

var ClientRenderer = require("./ClientRenderer");
var ClientRequest = require("./ClientRequest");
var ClientResponse = require("./ClientResponse");
var LayoutDelegate = require("../controlling/LayoutDelegate");
var ErrorPage = require("../errors/ErrorPage");
var Errors = require("../errors/Errors");
var addExtraParamsTo = require("../util/addExtraParamsTo");
var validateView = require("../util/validateView");
var RedirectOnNewLayout = require("../controlling/RedirectOnNewLayout");
var Response = require("../controlling/Response");
var Backbone = require("../application/Backbone");
var setKeys = require("../util/setKeys");

var Promise = require("promise");
var promisify = require("../util/promisify")(Promise);

var currentRequestId = 0;
var currentLayout;
var whenLayoutDataFetched;
var environmentConfig = {};

var ClientRenderingWorkflow = {

    execute: function(router, originalHandler, params, windough) {
        windough = windough || window;
        currentRequestId = currentRequestId + 1;

        var clientRequest = ClientRequest.from(windough, currentRequestId, environmentConfig);
        var clientResponse = ClientResponse.from(windough);

        var LayoutForRoute = router.layout;
        var errorViewMapping = router.errorViewMapping;
        var onRouteStart = router.onRouteStart;
        var onRouteComplete = router.onRouteComplete;

        var isFirstPageLoad = !currentLayout;
        var layoutForRouteIsDifferentFromCurrent = !isFirstPageLoad && !currentLayout.isSameTypeAs(LayoutForRoute);

        if (layoutForRouteIsDifferentFromCurrent) {
            if (RedirectOnNewLayout.should(environmentConfig)) {
                windough.location.replace(
                    Response.redirectDestinationFrom(clientRequest.applicationPath)
                );
                return;
            } else {
                var reason = new Error(
                    "Brisket doesn't support changing Layout on the client side. To link " +
                    "to a route with a different layout, use an absolute link (e.g. href='/route')."
                );

                return logAndRenderError(reason, currentLayout, errorViewMapping, clientRequest, currentRequestId);
            }
        }

        var layout = currentLayout;
        var recordedState = layout ? clear(layout.model.toJSON()) : {};

        var recording = true;

        var layoutDelegate = LayoutDelegate.from(LayoutForRoute, function setRouteState(key, value) {
            if (recording) {
                setKeys(recordedState, key, value);
                return;
            }

            layout.model.set(key, value);
        });

        // If handler returns a view, this function returns a promise of a view
        // If handler returns a promise of a view, this function returns a promise of a view
        // and absorbs the state of the returned promise
        function chooseViewForRoute() {
            var allParams = addExtraParamsTo(params,
                layoutDelegate,
                clientRequest,
                clientResponse
            );

            return promisify(originalHandler).apply(router, allParams)
                .then(function(view) {
                    validateView(view);

                    return {
                        view: view,
                        reason: null
                    };
                })
                .catch(function(reason) {
                    return {
                        view: null,
                        reason: reason
                    };
                });
        }

        /*
         * Deprecated: Passing request as options is an intermediate
         * fix while we plan a better way to get this where it's needed.
         */
        function initializeLayout(workflowState) {
            if (!isFirstPageLoad) {
                return workflowState;
            }

            var stateForLayout = workflowState.reason ? null : recordedState;

            layout = new LayoutForRoute({
                request: clientRequest,
                model: new Backbone.Model(stateForLayout)
            });

            layout.setEnvironmentConfig(environmentConfig);

            currentLayout = layout;

            return workflowState;
        }

        function fetchLayoutData(workflowState) {
            if (!whenLayoutDataFetched) {
                whenLayoutDataFetched = promisify(layout.fetchData).call(layout);
            }

            return whenLayoutDataFetched
                .then(function() {
                    return workflowState;
                })
                .catch(function(reason) {
                    if (isFirstPageLoad) {
                        workflowState.reason = workflowState.reason || reason;
                    }

                    return workflowState;
                });
        }

        function renderLayout() {
            if (layout.hasBeenRendered) {
                return;
            }

            layout.reattach();
            layout.render();
        }

        function executeLayoutInstructions(requestId) {
            if (!isCurrentRequest(requestId)) {
                return;
            }

            if (!isFirstPageLoad) {
                layout.backToNormal();
                layout.model.set(recordedState);
            }

            layoutDelegate.replayInstructions(layout);
            layoutDelegate.stopRecording(layout);
            recording = false;
        }

        function enterDOM(view) {
            if (isFirstPageLoad) {
                layout.enterDOM();
            }

            return view;
        }

        function close(requestId) {
            if (isCurrentRequest(requestId)) {
                onRouteComplete(layoutDelegate, clientRequest, clientResponse);
                clientRequest.complete();
                ClientRequest.setPreviousRequest(clientRequest);
            }

            clientRequest.off();

            router.close();
        }

        return (function(requestId) {

            onRouteStart(layoutDelegate, clientRequest, clientResponse);

            return chooseViewForRoute()
                .then(
                    initializeLayout
                )
                .then(
                    fetchLayoutData
                )
                .then(function(workflowState) {
                    var view = workflowState.view;
                    var reason = workflowState.reason;

                    if (reason === ClientResponse.INTERRUPT_RENDERING) {
                        return;
                    }

                    renderLayout();

                    if (reason) {
                        throw reason;
                    }

                    executeLayoutInstructions(requestId);

                    return renderView(view, layout, requestId);
                })["catch"](function(reason) {
                    logAndRenderError(
                        reason,
                        layout,
                        errorViewMapping,
                        clientRequest,
                        requestId
                    );
                })["finally"](function() {
                    try {
                        enterDOM();
                        return close(requestId);
                    } catch (e) {
                        Errors.notify(e, clientRequest);
                        throw e;
                    }
                });

        })(currentRequestId);
    },

    setEnvironmentConfig: function(newEnvironmentConfig) {
        environmentConfig = newEnvironmentConfig;
    },

    reset: function() {
        currentRequestId = 0;
        currentLayout = null;
        whenLayoutDataFetched = null;
        environmentConfig = {};
    }

};

function isCurrentRequest(requestId) {
    return requestId === currentRequestId;
}

function notCurrentRequest(requestId) {
    return requestId !== currentRequestId;
}

function isACanceledRequest(jqxhr) {
    if (jqxhr && (jqxhr.readyState === 0 || jqxhr.status === 0)) {
        return true;
    }

    return false;
}

function render(layout, view, requestId) {
    return ClientRenderer.render(layout, view, requestId);
}

function renderView(view, layout, requestId) {
    if (notCurrentRequest(requestId)) {
        return;
    }

    return render(layout, view, requestId);
}

function logAndRenderError(reason, layout, errorViewMapping, clientRequest, requestId) {
    Errors.notify(reason, clientRequest);

    if (notCurrentRequest(requestId)) {
        return;
    }

    if (isACanceledRequest(reason)) {
        return;
    }

    layout.backToNormal();
    layout.model.set(clear(layout.model.toJSON()), {
        silent: requestId === 1
    });

    layout.clearContent();

    var ErrorView = ErrorPage.viewFor(errorViewMapping, reason.status);

    if (!ErrorView) {
        throw reason;
    }

    return render(layout, new ErrorView(), requestId);
}

function clear(state) {
    var keys = Object.keys(state);
    var clearedState = {};

    for (var i = keys.length - 1; i >= 0; i--) {
        clearedState[keys[i]] = void 0;
    }

    return clearedState;
}

module.exports = ClientRenderingWorkflow;

// ----------------------------------------------------------------------------
// Copyright (C) 2016 Bloomberg Finance L.P.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------- END-OF-FILE ----------------------------------
