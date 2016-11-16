"use strict";

var ClientRenderer = require("./ClientRenderer");
var ClientRequest = require("./ClientRequest");
var ClientResponse = require("./ClientResponse");
var LayoutDelegate = require("../controlling/LayoutDelegate");
var ErrorPage = require("../errors/ErrorPage");
var Errors = require("../errors/Errors");
var addExtraParamsTo = require("../util/addExtraParamsTo");
var validateView = require("../util/validateView");
var Promise = require("promise");
var RedirectOnNewLayout = require("../controlling/RedirectOnNewLayout");
var Response = require("../controlling/Response");

var currentRequestId = 0;
var currentLayout;
var whenLayoutDataFetched;
var environmentConfigForAllRequests = {};

var ClientRenderingWorkflow = {

    execute: function(router, originalHandler, params, windough) {
        windough = windough || window;
        currentRequestId = currentRequestId + 1;

        var clientRequest = ClientRequest.from(windough, currentRequestId, environmentConfigForAllRequests);
        var clientResponse = ClientResponse.from(windough);

        var LayoutForRoute = router.layout;
        var errorViewMapping = router.errorViewMapping;
        var onRouteStart = router.onRouteStart;
        var onRouteComplete = router.onRouteComplete;

        var isFirstPageLoad = !currentLayout;
        var layoutForRouteIsDifferentFromCurrent = !isFirstPageLoad && !currentLayout.isSameTypeAs(LayoutForRoute);

        if (layoutForRouteIsDifferentFromCurrent) {
            if (RedirectOnNewLayout.should(environmentConfigForAllRequests)) {
                windough.location.replace(
                    Response.redirectDestinationFrom(clientRequest.applicationPath)
                );
                return;
            } else {
                return redirectOrLogAndRenderError(currentLayout, errorViewMapping, clientRequest, currentRequestId)(
                    new Error(
                        "Brisket doesn't support changing Layout on the client side. To link " +
                        "to a route with a different layout, use an absolute link (e.g. href='/route')."
                    )
                );
            }
        }

        // Deprecated: Passing request as options is an intermediate
        // fix while we plan a better way to get this where it's needed.
        var layout = currentLayout || new LayoutForRoute({
            request: clientRequest
        });

        if (isFirstPageLoad) {
            currentLayout = layout;
            layout.setEnvironmentConfig(environmentConfigForAllRequests);
        }

        var layoutDelegate = LayoutDelegate.from(layout);

        var fetchLayoutData = promisify(function() {
            return layout.fetchData();
        });

        // If handler returns a view, this function returns a promise of a view
        // If handler returns a promise of a view, this function returns a promise of a view
        // and absorbs the state of the returned promise
        var chooseViewForRoute = promisify(function() {
            var allParams = addExtraParamsTo(params,
                layoutDelegate,
                clientRequest,
                clientResponse
            );

            return originalHandler.apply(router, allParams);
        });

        var chooseViewForRouteAndValidate = promisify(function() {
            return chooseViewForRoute().then(validateView);
        });

        function renderLayout(view) {
            if (!layout.hasBeenRendered) {
                layout.reattach();
                layout.render();
            }

            return view;
        }

        function executeLayoutInstructions(requestId) {
            return function(view) {

                if (isCurrentRequest(requestId)) {
                    if (!isFirstPageLoad) {
                        layout.backToNormal();
                    }

                    layoutDelegate.replayInstructions();
                    layoutDelegate.stopRecording();
                }

                return view;
            };
        }

        function enterDOM(view) {
            if (isFirstPageLoad) {
                layout.enterDOM();
            }

            return view;
        }

        function close(requestId) {
            if (isCurrentRequest(requestId)) {
                onRouteComplete(layout, clientRequest, clientResponse);
                clientRequest.complete();
                ClientRequest.setPreviousRequest(clientRequest);
            }

            clientRequest.off();

            router.close();
        }

        if (!whenLayoutDataFetched) {
            whenLayoutDataFetched = fetchLayoutData();
        }

        return (function(requestId) {

            onRouteStart(layout, clientRequest, clientResponse);

            return whenLayoutDataFetched
                .then(
                    chooseViewForRouteAndValidate
                )
                .then(
                    renderLayout
                )
                .then(
                    executeLayoutInstructions(requestId)
                )
                .then(
                    renderView(layout, requestId)
                )
                .then(
                    enterDOM
                )["catch"](
                    redirectOrLogAndRenderError(layout, errorViewMapping, clientRequest, requestId)
                )["finally"](function() {
                    try {
                        return close(requestId);
                    } catch (e) {
                        Errors.notify(e, clientRequest);
                        throw e;
                    }
                });

        })(currentRequestId);
    },

    setEnvironmentConfig: function(environmentConfig) {
        environmentConfigForAllRequests = environmentConfig;
    },

    reset: function() {
        currentRequestId = 0;
        currentLayout = null;
        whenLayoutDataFetched = null;
        environmentConfigForAllRequests = {};
    }

};

function promisify(method) {
    return function() {
        var args = new Array(arguments.length);
        var context = this || null;

        for (var i = arguments.length - 1; i > -1; i--) {
            args[i] = arguments[i];
        }

        return Promise.resolve()
            .then(function() {
                return method.apply(context, args);
            });
    };
}

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

function renderView(layout, requestId) {
    return function(view) {
        if (notCurrentRequest(requestId)) {
            return;
        }

        return render(layout, view, requestId);
    };
}

function redirectOrLogAndRenderError(layout, errorViewMapping, clientRequest, requestId) {
    return function(reason) {
        if (reason === ClientResponse.INTERRUPT_RENDERING) {
            return;
        }

        Errors.notify(reason, clientRequest);

        if (notCurrentRequest(requestId)) {
            return;
        }

        if (isACanceledRequest(reason)) {
            return;
        }

        layout.backToNormal();
        layout.clearContent();

        var ErrorView = ErrorPage.viewFor(errorViewMapping, reason.status);

        if (!ErrorView) {
            throw reason;
        }

        return render(layout, new ErrorView(), requestId);
    };
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
