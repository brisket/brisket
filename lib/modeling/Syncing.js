"use strict";

var Promise = require("bluebird");
var defer = require("../util/defer");
var Backbone = require("../application/Backbone");

var middlewares = [];

var Syncing = {

    sync: function(method, model, options) {
        var deferredError = defer();
        var forceReturnedData = null;

        function renderError(e) {
            deferredError.reject(e);
        }

        function returnData(data) {
            forceReturnedData = data;
        }

        for (var i = 0, len = middlewares.length; i < len; ++i) {
            middlewares[i](method, model, options, returnData, renderError);
        }

        function returnDataIfRequestedByMiddleware() {
            if (forceReturnedData) {
                if (options && typeof options.success === "function") {
                    options.success(forceReturnedData);
                }

                return Promise.resolve(forceReturnedData);
            }

            return Promise.resolve();
        }

        function performNormalSyncUnlessShortCircuited(data) {
            if (data) {
                return data;
            }

            return Backbone.sync(method, model, options);
        }

        function renderErrorIfRequestedByMiddleware(data) {
            if (deferredError.promise.isRejected()) {
                return deferredError.promise;
            }

            return data;
        }

        return returnDataIfRequestedByMiddleware()
            .then(performNormalSyncUnlessShortCircuited)
            .then(renderErrorIfRequestedByMiddleware);
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
