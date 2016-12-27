"use strict";

var ServerRenderer = require("./ServerRenderer");
var ServerRequest = require("./ServerRequest");
var ServerResponse = require("./ServerResponse");
var LayoutDelegate = require("../controlling/LayoutDelegate");
var ErrorPage = require("../errors/ErrorPage");
var Errors = require("../errors/Errors");
var addExtraParamsTo = require("../util/addExtraParamsTo");
var AjaxCallsForCurrentRequest = require("./AjaxCallsForCurrentRequest");
var validateView = require("../util/validateView");
var Backbone = require("../application/Backbone");
var setKeys = require("../util/setKeys");

// need domain support for AjaxCallsForCurrentRequest
var Promise = require("promise/domains");
var promisify = require("../util/promisify")(Promise);

var ServerRenderingWorkflow = {

    execute: function(router, originalHandler, params, expressRequest, environmentConfig) {
        var serverRequest = ServerRequest.from(expressRequest, environmentConfig);
        var serverResponse = ServerResponse.create();

        var LayoutForRoute = router.layout;
        var errorViewMapping = router.errorViewMapping;

        var recordedState = {};
        var layoutDelegate = LayoutDelegate.from(LayoutForRoute, function setRouteState(key, value) {
            setKeys(recordedState, key, value);
        });

        var layout;

        // If handler returns a view, this function returns a promise of a view
        // If handler returns a promise of a view, this function returns a promise of a view
        // and absorbs the state of the returned promise
        function chooseViewForRoute() {
            var allParams = addExtraParamsTo(params,
                layoutDelegate,
                serverRequest,
                serverResponse
            );

            return promisify(originalHandler).apply(router, allParams)
                .then(function(view) {
                    validateView(view);

                    return {
                        view: view,
                        reason: null,
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
            var stateForLayout = workflowState.reason ? {} : recordedState;

            stateForLayout["environmentConfig"] = environmentConfig;

            try {
                layout = new LayoutForRoute({
                    request: serverRequest,
                    model: new Backbone.Model(stateForLayout)
                });
            } catch (reason) {
                workflowState.reason = reason;

                layout = new LayoutForRoute({
                    request: serverRequest,
                    model: new Backbone.Model({
                        environmentConfig: environmentConfig
                    })
                });
            }

            layout.setEnvironmentConfig(environmentConfig);

            return workflowState;
        }

        function fetchLayoutData(workflowState) {
            return promisify(layout.fetchData).call(layout)
                .then(function() {
                    return workflowState;
                })
                .catch(function(reason) {
                    workflowState.reason = workflowState.reason || reason;

                    return workflowState;
                });
        }

        function executeLayoutInstructions() {
            layoutDelegate.replayInstructions(layout);
            layoutDelegate.stopRecording(layout);
        }

        function close() {
            if (layout) {
                layout.close();
            }
            router.close();
            AjaxCallsForCurrentRequest.clear();
        }

        var forRoute = {
            environmentConfig: environmentConfig,
            expressRequest: expressRequest,
            serverRequest: serverRequest,
            serverResponse: serverResponse,
            errorViewMapping: errorViewMapping
        };

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

                if (reason === ServerResponse.INTERRUPT_RENDERING) {
                    return {
                        html: null,
                        serverResponse: serverResponse
                    };
                }

                layout.render();

                if (reason) {
                    throw reason;
                }

                executeLayoutInstructions();

                return {
                    html: renderPage(view, layout, forRoute),
                    serverResponse: serverResponse
                };
            })["catch"](function(reason) {
                return logAndRenderError(reason, layout, forRoute);
            })["finally"](function() {
                try {
                    return close();
                } catch (e) {
                    Errors.notify(e, expressRequest);
                    throw e;
                }
            });
    }

};

function renderPage(view, layout, forRoute) {
    return ServerRenderer.render(
        layout,
        view,
        forRoute.environmentConfig,
        forRoute.serverRequest
    );
}

function logAndRenderError(reason, layout, forRoute) {
    var serverResponse = forRoute.serverResponse;
    var errorViewMapping = forRoute.errorViewMapping;

    Errors.notify(reason, forRoute.expressRequest);

    var ErrorView = ErrorPage.viewFor(errorViewMapping, reason.status);

    if (!ErrorView || !layout) {
        throw reason;
    }

    var status = ErrorPage.getStatus(errorViewMapping, reason.status);

    serverResponse.status(status);
    serverResponse.fail();

    layout.model.clear({
        silent: true
    });

    if (!layout.hasBeenRendered) {
        layout.render();
    }

    layout.clearContent();

    return {
        html: renderPage(new ErrorView(), layout, forRoute),
        serverResponse: serverResponse
    };
}

module.exports = ServerRenderingWorkflow;

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
