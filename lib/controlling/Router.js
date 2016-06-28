"use strict";

var Backbone = require("../application/Backbone");
var noop = require("../util/noop");
var Promise = require("promise");
var Environment = require("../environment/Environment");
var _ = require("underscore");

var Router = Backbone.Router.extend({

    layout: null,
    errorViewMapping: null,

    onClose: noop,

    close: function() {
        try {
            this.onClose();
        } catch (e) {
            console.error(
                "Error: There is an error in a Router's onClose callback."
            );

            throw e;
        }
    },

    onRouteStart: noop.thatWillBeCalledWith( /* layout, request, response */ ),

    onRouteComplete: noop.thatWillBeCalledWith( /* layout, request, response */ ),

    renderError: function(statusCode) {
        return Promise.reject({
            status: statusCode
        });
    },

    route: function(route, name, callback) {
        var rawRoute = route;

        if (!_.isRegExp(route)) {
            route = this._routeToRegExp(route);
        }

        if (_.isFunction(name)) {
            callback = name;
            name = '';
        }

        if (!callback) {
            callback = this[name];
        }

        if (Environment.isServer()) {
            addRouteToServerDispatcher(this, route, rawRoute, callback);
        }

        if (Environment.isClient()) {
            addRouteToBackboneHistory(this, route, rawRoute, name, callback);
        }

        return this;
    }

});

function addRouteToServerDispatcher(router, route, rawRoute, callback) {
    var ServerDispatcher = require("../server/ServerDispatcher");
    var ServerRenderingWorkflow = require("../server/ServerRenderingWorkflow");

    ServerDispatcher.addRoute(route, rawRoute, function(fragment, expressRequest, environmentConfig) {
        var params = router._extractParameters(route, fragment);

        if (!callback) {
            return;
        }

        var responseForRoute = ServerRenderingWorkflow.execute(
            router,
            callback,
            params,
            expressRequest,
            environmentConfig
        );

        return responseForRoute;
    });
}

function addRouteToBackboneHistory(router, route, rawRoute, name, callback) {
    var ClientRenderingWorkflow = require("../client/ClientRenderingWorkflow");

    Backbone.history.route(route, function(fragment) {
        var params = router._extractParameters(route, fragment);

        if (!callback) {
            return;
        }

        ClientRenderingWorkflow.execute(router, callback, params);

        router.trigger.apply(router, ["route:" + name].concat(params));
        router.trigger("route", name, params);
        Backbone.history.trigger("route", router, name, params);
    });
}

module.exports = Router;

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
