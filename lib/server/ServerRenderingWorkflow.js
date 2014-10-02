"use strict";

var ServerRenderer = require("./ServerRenderer");
var ServerRequest = require("./ServerRequest");
var Promise = require("bluebird");
var Errors = require("../errors/Errors");
var addBrisketRequest = require("../util/addBrisketRequest");

var ServerRenderingWorkflow = {

    createHandlerFrom: function(originalHandler) {
        return function(params, request, environmentConfig, clientAppRequirePath) {
            var serverRequest = ServerRequest.from(request);
            var host = request.headers.host;
            var routeArguments = params;

            var router = this;
            var LayoutForRoute = router.layout;
            var errorViewMappingForRoute = router.errorViewMapping;
            var onRender = router.onRender;

            var layout = new LayoutForRoute();

            // If handler returns a view, this function returns a promise of a view
            // If handler returns a promise of a view, this function returns a promise of a view
            // and absorbs the state of the returned promise
            var chooseViewForRoute = Promise.method(function() {
                var paramsAndRequest = addBrisketRequest(routeArguments, serverRequest);

                return originalHandler.apply(router, paramsAndRequest);
            });

            var fetchLayoutData = Promise.method(function() {
                return layout.fetchData();
            });

            return fetchLayoutData()
                .then(
                    chooseViewForRoute
                )
                .then(
                    renderPage(layout, onRender, host, environmentConfig, clientAppRequirePath, serverRequest)
                )
                .caught(
                    logAndRenderError(layout, errorViewMappingForRoute, onRender, host, environmentConfig, clientAppRequirePath, serverRequest)
                )
                .lastly(function() {
                    layout.close();
                    router.close();
                });
        };
    }

};

function render(layout, view, onRender, host, environmentConfig, clientAppRequirePath, request) {
    return ServerRenderer.render(layout, view, onRender, host, environmentConfig, clientAppRequirePath, request);
}

function renderPage(layout, onRender, host, environmentConfig, clientAppRequirePath, request) {
    return function(view) {
        return render(layout, view, onRender, host, environmentConfig, clientAppRequirePath, request);
    };
}

function logAndRenderError(layout, errorViewMappingForRoute, onRender, host, environmentConfig, clientAppRequirePath, request) {
    return function(jqxhr) {
        Errors.log(jqxhr);

        var ErrorView = errorViewMappingForRoute.viewFor(jqxhr.status);
        var status = errorViewMappingForRoute.getStatus(jqxhr.status);

        return Promise.reject({
            html: render(layout, new ErrorView(), onRender, host, environmentConfig, clientAppRequirePath, request),
            status: status
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
