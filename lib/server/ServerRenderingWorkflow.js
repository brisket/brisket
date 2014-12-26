"use strict";

var ServerRenderer = require("./ServerRenderer");
var ServerRequest = require("./ServerRequest");
var ServerResponse = require("./ServerResponse");
var Promise = require("bluebird");
var Errors = require("../errors/Errors");
var addBrisketRequestAndResponse = require("../util/addBrisketRequestAndResponse");
var AjaxCallsForCurrentRequest = require("./AjaxCallsForCurrentRequest");
var validateView = require("../util/validateView");

var ServerRenderingWorkflow = {

    createHandlerFrom: function(originalHandler) {
        return function(params, expressRequest, environmentConfig, clientAppRequirePath) {
            var serverRequest = ServerRequest.from(expressRequest);
            var serverResponse = ServerResponse.create();

            var routeArguments = params;
            var router = this;
            var LayoutForRoute = router.layout;
            var errorViewMapping = router.errorViewMapping;
            var onRender = router.onRender;
            var layout = new LayoutForRoute();

            // If handler returns a view, this function returns a promise of a view
            // If handler returns a promise of a view, this function returns a promise of a view
            // and absorbs the state of the returned promise
            var chooseViewForRoute = Promise.method(function() {
                var paramsAndRequest = addBrisketRequestAndResponse(routeArguments, serverRequest, serverResponse);

                return originalHandler.apply(router, paramsAndRequest);
            });

            var fetchLayoutData = Promise.method(function() {
                return layout.fetchData();
            });

            var forRoute = {
                layout: layout,
                onRender: onRender,
                environmentConfig: environmentConfig,
                clientAppRequirePath: clientAppRequirePath,
                serverRequest: serverRequest,
                serverResponse: serverResponse,
                errorViewMapping: errorViewMapping
            };

            return fetchLayoutData()
                .then(
                    chooseViewForRoute
                )
                .then(
                    renderPage(forRoute)
                )
                .caught(
                    redirectOrLogAndRenderError(forRoute)
                )
                .lastly(function() {
                    layout.close();
                    router.close();
                    AjaxCallsForCurrentRequest.clear();
                });
        };
    }

};

function render(view, forRoute) {
    return ServerRenderer.render(
        forRoute.layout,
        view,
        forRoute.onRender,
        forRoute.environmentConfig,
        forRoute.clientAppRequirePath,
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
            return Promise.resolve({
                html: null,
                serverResponse: forRoute.serverResponse
            });
        }

        Errors.notify(reason);

        var errorViewMapping = forRoute.errorViewMapping;
        var ErrorView = errorViewMapping.viewFor(reason.status);
        var status = errorViewMapping.getStatus(reason.status);

        forRoute.serverResponse.status(status);

        return Promise.reject({
            html: render(new ErrorView(), forRoute),
            serverResponse: forRoute.serverResponse
        });
    };
}

module.exports = ServerRenderingWorkflow;

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
