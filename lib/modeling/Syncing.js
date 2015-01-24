"use strict";

var defer = require("../util/defer");
var Backbone = require("../application/Backbone");
var _ = require("lodash");

var middlewares = [];

var Syncing = {

    sync: function(method, model, options) {
        var deferred = defer();

        function renderError(e) {
            deferred.reject(e);
        }

        function renderErrorIfRequestedByMiddleware(data) {
            if (deferred.promise.isRejected()) {
                return deferred.promise;
            }

            return data;
        }

        _.each(middlewares, function(middleware) {
            middleware(method, model, options, renderError);
        });

        return Backbone.sync(method, model, options).then(renderErrorIfRequestedByMiddleware);
    },

    beforeSync: function(middleware) {
        middlewares.push(middleware);
    },

    clearMiddlewares: function() {
        middlewares.length = 0;
    }

};

module.exports = Syncing;

// ----------------------------------------------------------------------------
// Copyright (C) 2015 Bloomberg Finance L.P.
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
