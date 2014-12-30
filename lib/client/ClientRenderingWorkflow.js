"use strict";

var ClientRenderer = require("./ClientRenderer");
var ClientRequest = require("./ClientRequest");
var ClientResponse = require("./ClientResponse");
var LayoutDelegate = require("../controlling/LayoutDelegate");
var Promise = require("bluebird");
var Errors = require("../errors/Errors");
var addExtraParamsTo = require("../util/addExtraParamsTo");
var validateView = require("../util/validateView");

var currentRequestId = 0;
var currentLayout;
var whenCurrentLayoutDataFetched;

var ClientRenderingWorkflow = {

    createHandlerFrom: function(originalHandler) {
        return function() {
            currentRequestId = currentRequestId + 1;

            var clientRequest = ClientRequest.from(window, currentRequestId);
            var clientResponse = ClientResponse.from(window);

            var router = this;
            var LayoutForRoute = router.layout;
            var errorViewMappingForRoute = router.errorViewMapping;
            var onRouteStart = router.onRouteStart;
            var onRouteComplete = router.onRouteComplete;
            var routeArguments = Array.prototype.slice.call(arguments, 0);

            var isInitialPageLoad = !currentLayout;
            var layoutForRouteIsSameAsCurrent = isInitialPageLoad || currentLayout.isSameTypeAs(LayoutForRoute);
            var shouldUseCurrentLayout = !isInitialPageLoad && layoutForRouteIsSameAsCurrent;
            var layout = shouldUseCurrentLayout ? currentLayout : new LayoutForRoute();
            var layoutDelegate = LayoutDelegate.from(layout, LayoutForRoute);

            if (isInitialPageLoad) {
                currentLayout = layout;
            }

            if (!layoutForRouteIsSameAsCurrent) {
                whenCurrentLayoutDataFetched = null;
            }

            var currentLayoutDataHasBeenFetched = whenCurrentLayoutDataFetched && !whenCurrentLayoutDataFetched.isPending();

            var initializeLayout = Promise.method(function() {
                if (layout.hasBeenRendered) {
                    return;
                }

                layout.reattach();
                layout.render();
                layout.enterDOM();
            });

            var fetchLayoutData = Promise.method(function() {
                return layout.fetchData();
            });

            // If handler returns a view, this function returns a promise of a view
            // If handler returns a promise of a view, this function returns a promise of a view
            // and absorbs the state of the returned promise
            var chooseViewForRoute = Promise.method(function() {
                var allParams = addExtraParamsTo(routeArguments,
                    layoutDelegate,
                    clientRequest,
                    clientResponse
                );

                return originalHandler.apply(router, allParams);
            });

            var putLayoutBackToNormalAndExecuteLayoutInstructions = Promise.method(function(view) {
                layout.backToNormal();
                layoutDelegate.replayInstructions();

                return view;
            });

            if (!currentLayoutDataHasBeenFetched) {
                whenCurrentLayoutDataFetched = fetchLayoutData();
            }

            return (function(requestId) {

                onRouteStart(layout, clientRequest, clientResponse);

                return whenCurrentLayoutDataFetched
                    .then(
                        initializeLayout
                    )
                    .then(
                        chooseViewForRoute
                    )
                    .then(
                        putLayoutBackToNormalAndExecuteLayoutInstructions
                    )
                    .then(
                        renderView(layout, requestId)
                    )
                    .caught(
                        redirectOrLogAndRenderError(layout, errorViewMappingForRoute, requestId)
                    )
                    .lastly(function() {
                        if (isCurrentRequest(requestId)) {
                            onRouteComplete(layout, clientRequest, clientResponse);
                            ClientRequest.setPreviousRequest(clientRequest);
                        }

                        if (notCurrentRequest(requestId) && !layout.isSameAs(currentLayout)) {
                            layout.close();
                            router.close();
                            return;
                        }

                        router.close();

                        if (layoutForRouteIsSameAsCurrent) {
                            return;
                        }

                        currentLayout.close();
                        currentLayout = layout;
                    });

            })(currentRequestId);
        };
    },

    reset: function() {
        currentRequestId = 0;
        currentLayout = null;
        whenCurrentLayoutDataFetched = null;
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

function renderView(layout, requestId) {
    return function(view) {
        if (notCurrentRequest(requestId)) {
            return;
        }

        validateView(view);

        return render(layout, view, requestId);
    };
}

function redirectOrLogAndRenderError(layout, errorViewMappingForRoute, requestId) {
    return function(reason) {
        if (reason === ClientResponse.INTERRUPT_RENDERING) {
            return;
        }

        Errors.notify(reason);

        if (notCurrentRequest(requestId)) {
            return;
        }

        if (isACanceledRequest(reason)) {
            return;
        }

        var ErrorView = errorViewMappingForRoute.viewFor(reason.status);

        return render(layout, new ErrorView(), requestId);
    };
}

module.exports = ClientRenderingWorkflow;

// ----------------------------------------------------------------------------
// Copyright (C) 2014 Bloomberg Finance L.P.
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
