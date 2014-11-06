"use strict";

var ClientRenderer = require("./ClientRenderer");
var ClientRequest = require("./ClientRequest");
var Promise = require("bluebird");
var Errors = require("../errors/Errors");
var addBrisketRequest = require("../util/addBrisketRequest");
var validateView = require("../util/validateView");

var currentRequestId = 0;
var currentLayout;

var ClientRenderingWorkflow = {

    createHandlerFrom: function(originalHandler) {
        return function() {
            currentRequestId = currentRequestId + 1;

            var clientRequest = ClientRequest.from(window, currentRequestId);

            var router = this;
            var onRender = router.onRender;
            var LayoutForRoute = router.layout;
            var errorViewMappingForRoute = router.errorViewMapping;
            var onRouteStart = router.onRouteStart;
            var onRouteComplete = router.onRouteComplete;
            var routeArguments = Array.prototype.slice.call(arguments, 0);

            var isInitialPageLoad = !currentLayout;
            var layoutForRouteIsSameAsCurrent = isInitialPageLoad || currentLayout.isSameTypeAs(LayoutForRoute);
            var shouldInitializeLayout = isInitialPageLoad || !layoutForRouteIsSameAsCurrent;
            var shouldUseCurrentLayout = !isInitialPageLoad && layoutForRouteIsSameAsCurrent;

            var layout = shouldUseCurrentLayout ? currentLayout : new LayoutForRoute();

            if (isInitialPageLoad) {
                currentLayout = layout;
            }

            // If handler returns a view, this function returns a promise of a view
            // If handler returns a promise of a view, this function returns a promise of a view
            // and absorbs the state of the returned promise
            var chooseViewForRoute = Promise.method(function() {
                var paramsAndRequest = addBrisketRequest(routeArguments, clientRequest);

                return originalHandler.apply(router, paramsAndRequest);
            });

            var fetchLayoutDataIfLayoutIsDifferentFromCurrent = Promise.method(function() {
                if (!isInitialPageLoad && layoutForRouteIsSameAsCurrent) {
                    return;
                }

                return layout.fetchData();
            });

            return (function(requestId) {

                onRouteStart(layout, clientRequest);

                return fetchLayoutDataIfLayoutIsDifferentFromCurrent()
                    .then(
                        chooseViewForRoute
                    )
                    .then(
                        renderView(layout, shouldInitializeLayout, onRender, requestId)
                    )
                    .caught(
                        logAndRenderError(layout, shouldInitializeLayout, errorViewMappingForRoute, onRender, requestId)
                    )
                    .lastly(function() {
                        if (isCurrentRequest(requestId)) {
                            onRouteComplete(layout, clientRequest);
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

function render(layout, shouldInitializeLayout, view, onRender, requestId) {
    return ClientRenderer.render(layout, shouldInitializeLayout, view, onRender, requestId);
}

function renderView(layout, shouldInitializeLayout, onRender, requestId) {
    return function(view) {
        if (notCurrentRequest(requestId)) {
            return;
        }

        validateView(view);

        return render(layout, shouldInitializeLayout, view, onRender, requestId);
    };
}

function logAndRenderError(layout, shouldInitializeLayout, errorViewMappingForRoute, onRender, requestId) {
    return function(jqxhr) {
        Errors.notify(jqxhr);

        if (notCurrentRequest(requestId)) {
            return;
        }

        if (isACanceledRequest(jqxhr)) {
            return;
        }

        var ErrorView = errorViewMappingForRoute.viewFor(jqxhr.status);

        return render(layout, shouldInitializeLayout, new ErrorView(), onRender, requestId);
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
