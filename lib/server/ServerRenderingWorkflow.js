"use strict";

var ServerRenderer = require("./ServerRenderer");
var ServerRequest = require("./ServerRequest");
var ServerResponse = require("./ServerResponse");
var LayoutDelegate = require("../controlling/LayoutDelegate");
var Errors = require("../errors/Errors");
var addExtraParamsTo = require("../util/addExtraParamsTo");
var AjaxCallsForCurrentRequest = require("./AjaxCallsForCurrentRequest");
var validateView = require("../util/validateView");

// need domain support for AjaxCallsForCurrentRequest
var Promise = require("promise/domains");

var ServerRenderingWorkflow = {

    execute: function(router, originalHandler, params, expressRequest, environmentConfig) {
        var serverRequest = ServerRequest.from(expressRequest, environmentConfig);
        var serverResponse = ServerResponse.create();

        var LayoutForRoute = router.layout;
        var errorViewMapping = router.errorViewMapping;

        // Deprecated: Passing request as options is an intermediate
        // fix while we plan a better way to get this where it's needed.
        var layout = new LayoutForRoute({
            request: serverRequest
        });

        var layoutDelegate = LayoutDelegate.from(layout);

        layout.setEnvironmentConfig(environmentConfig);

        var fetchLayoutData = promisify(function() {
            return layout.fetchData();
        });

        // If handler returns a view, this function returns a promise of a view
        // If handler returns a promise of a view, this function returns a promise of a view
        // and absorbs the state of the returned promise
        var chooseViewForRoute = promisify(function() {
            var allParams = addExtraParamsTo(params,
                layoutDelegate,
                serverRequest,
                serverResponse
            );

            return originalHandler.apply(router, allParams);
        });

        function renderLayout(view) {
            layout.render();

            return view;
        }

        function executeLayoutInstructions(view) {
            layoutDelegate.replayInstructions();
            layoutDelegate.stopRecording();

            return view;
        }

        function close() {
            layout.close();
            router.close();
            AjaxCallsForCurrentRequest.clear();
        }

        var forRoute = {
            layout: layout,
            environmentConfig: environmentConfig,
            expressRequest: expressRequest,
            serverRequest: serverRequest,
            serverResponse: serverResponse,
            errorViewMapping: errorViewMapping
        };

        return fetchLayoutData()
            .then(
                chooseViewForRoute
            )
            .then(
                renderLayout
            )
            .then(
                executeLayoutInstructions
            )
            .then(
                renderPage(forRoute)
            )["catch"](
                redirectOrLogAndRenderError(forRoute)
            )["finally"](function() {
                try {
                    return close();
                } catch (e) {
                    Errors.notify(e, expressRequest);
                    throw e;
                }
            });
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

function render(view, forRoute) {
    return ServerRenderer.render(
        forRoute.layout,
        view,
        forRoute.environmentConfig,
        forRoute.serverRequest
    );
}

function renderPage(forRoute) {
    return function(view) {
        validateView(view);

        return {
            html: render(view, forRoute),
            serverResponse: forRoute.serverResponse
        };
    };
}

function redirectOrLogAndRenderError(forRoute) {
    return function(reason) {
        if (reason === ServerResponse.INTERRUPT_RENDERING) {
            return {
                html: null,
                serverResponse: forRoute.serverResponse
            };
        }

        Errors.notify(reason, forRoute.expressRequest);

        var errorViewMapping = forRoute.errorViewMapping;
        var ErrorView = errorViewMapping.viewFor(reason.status);
        var status = errorViewMapping.getStatus(reason.status);
        var serverResponse = forRoute.serverResponse;
        var layout = forRoute.layout;

        serverResponse.status(status);
        serverResponse.fail();

        if (!layout.hasBeenRendered) {
            layout.render();
        }

        layout.clearContent();

        return {
            html: render(new ErrorView(), forRoute),
            serverResponse: forRoute.serverResponse
        };
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
