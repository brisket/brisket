"use strict";

var Backbone = require("../application/Backbone");
var _ = require("underscore");
var ServerDispatcher = require("./ServerDispatcher");

var ServerRouter = Backbone.Router.extend({

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

        var router = this;

        ServerDispatcher.addRoute(route, rawRoute, function(fragment, request, environmentConfig, clientAppRequirePath) {
            var params = router._extractParameters(route, fragment);
            var html = callback && callback.apply(router, [params, request, environmentConfig, clientAppRequirePath]);

            router.trigger.apply(router, ['route:' + name].concat(params));
            router.trigger('route', name, params);

            return html;
        });

        return this;
    }

});

module.exports = ServerRouter;

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
