"use strict";

var Testable = require("../util/Testable");
var Errors = require("../errors/Errors");
var _ = require("underscore");

var ForwardClientRequest = {

    toApi: function(apiConfig, apiAlias) {
        return function(req, res) {
            var options = {
                url: apiConfig.host + req.url,
                timeout: apiConfig.timeout || null
            };

            if (!_.isUndefined(apiConfig.proxy)) {
                options.proxy = apiConfig.proxy;
            }

            req
                .pipe(Testable.request(options))
                .on("response", function(message) {
                    if (success(message.statusCode)) {
                        return;
                    }

                    Errors.notify(message, req);
                })
                .on("error", function(error) {
                    Errors.notify({
                        error: error,
                        type: Errors.API_ERROR,
                        detail: {
                            url: options.url,
                            proxy: options.proxy,
                            apiAlias: apiAlias
                        }
                    }, req);
                })
                .pipe(res);
        };
    }

};

function success(status) {
    return status >= 200 && status < 300 || status === 304;
}

module.exports = ForwardClientRequest;

// ----------------------------------------------------------------------------
// Copyright (C) 2018 Bloomberg Finance L.P.
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
