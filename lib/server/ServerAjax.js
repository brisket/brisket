"use strict";

var Backbone = require("../application/Backbone");
var AjaxCallsForCurrentRequest = require("./AjaxCallsForCurrentRequest");
var Promise = require("bluebird");
var request = Promise.promisify(require("request"));

var FIND_API_ALIAS = /^\/([^\/]+)(\/.*$)/;
var originalAjax = Backbone.ajax;

var ServerAjax = {

    setup: function(apis) {
        Backbone.ajax = function(options) {
            var originalUrl = options.url;
            var queryParams = options.data;
            var urlParts = originalUrl.match(FIND_API_ALIAS);
            var apiAlias = urlParts[1];
            var apiConfig = apis[apiAlias];
            var apiPath = urlParts[2];
            var url = withTrailingSlash(apiConfig.host) + withoutLeadingSlash(apiPath);
            var proxy = apiConfig.proxy || null;

            return request({
                    url: url,
                    proxy: proxy
                })
                .then(function(message) {
                    var status = message.statusCode;
                    var bodyJSON = message.body;

                    if (!success(status)) {
                        var xhr = makeXhr(url, proxy, status);
                        var error = ajaxError(status);

                        if (options.error) {
                            options.error(xhr, status, error);
                        }

                        throw xhr;
                    }

                    var data = JSON.parse(bodyJSON);

                    if (options.success) {
                        options.success(data);
                    }

                    AjaxCallsForCurrentRequest.record(originalUrl, queryParams, data);

                    return data;
                });
        };
    },

    reset: function() {
        Backbone.ajax = originalAjax;
    }

};

function withoutLeadingSlash(string) {
    return string.replace(/^\//, "");
}

function withTrailingSlash(string) {
    return string.replace(/\/$/, "") + "/";
}

function success(status) {
    return status >= 200 && status < 300 || status === 304;
}

function makeXhr(url, proxy, status) {
    return {
        proxy: proxy,
        status: status,
        url: url
    };
}

function ajaxError(status) {
    return new Error("Server responded with a status of " + status);
}

module.exports = ServerAjax;

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
