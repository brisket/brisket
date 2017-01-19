"use strict";

var Backbone = require("../application/Backbone");
var AjaxCallsForCurrentRequest = require("./AjaxCallsForCurrentRequest");
var pathJoin = require("../util/pathJoin");
var Testable = require("../util/Testable");
var _ = require("underscore");

var originalAjax = Backbone.ajax;

var ServerAjax = {

    setup: function(apis) {
        var availableApis = specificityOrderedApis(apis);

        Backbone.ajax = function(options) {
            var originalUrl = options.url;
            var queryParams = options.data;
            var method = options.type ? options.type.toUpperCase() : "GET";

            var apiAlias = mostSpecificApiMatch(availableApis, originalUrl);
            var apiConfig = apis[apiAlias];
            var apiPath = originalUrl.replace(apiAlias + "/", "");
            var url = pathJoin(apiConfig.host, apiPath);

            var proxy = apiConfig.proxy || null;

            var requestOptions = {
                method: method,
                proxy: proxy
            };

            if (options.headers) {
                requestOptions.headers = options.headers;
            }

            if (requestOptions.method === "GET") {
                url = addParamsToUrl(url, queryParams);
            }

            requestOptions.url = url;

            return Testable.requestPromise(requestOptions)
                .then(function(incomingMessage) {
                    var status = incomingMessage.statusCode;
                    var responseBody = incomingMessage.body;

                    if (!success(status)) {
                        var xhr = makeXhr(url, proxy, status, responseBody);
                        var error = ajaxError(status);

                        if (_.isFunction(options.error)) {
                            options.error(xhr, status, error);
                        }

                        throw xhr;
                    }

                    var data, type;
                    var jsonRe = /^application\/json/;
                    type = incomingMessage.headers ? incomingMessage.headers["content-type"] : "";

                    if (jsonRe.test(type)) {
                        data = JSON.parse(responseBody);
                    } else {
                        data = responseBody;
                    }

                    if (_.isFunction(options.success)) {
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

function success(status) {
    return status >= 200 && status < 300 || status === 304;
}

function makeXhr(url, proxy, status, response) {
    return {
        proxy: proxy,
        status: status,
        url: url,
        response: response
    };
}

function ajaxError(status) {
    return new Error("Server responded with a status of " + status);
}

function stringifyRequestParams(queryParams) {
    if (!queryParams) {
        return;
    }

    var keys = Object.keys(queryParams);

    if (!keys) {
        return;
    }

    var params = [];

    keys.forEach(function(key) {
        var value = queryParams[key];

        if (value !== null) {
            var queryParam = encodeURIComponent(key) + "=" + encodeURIComponent(value);
            params.push(queryParam);
        }
    });

    return params.join("&");
}

function addParamsToUrl(url, queryParams) {
    var params = stringifyRequestParams(queryParams);

    if (!params) {
        return url;
    }

    var separator = (url.indexOf("?") === -1) ? "?" : "&";

    return url + separator + params;
}

function specificityOrderedApis(apis) {
    return Object.keys(apis).sort(function(a, b) {
        return a.length < b.length;
    });
}

function mostSpecificApiMatch(availableApis, originalUrl) {
    for (var i = 0; i < availableApis.length; i++) {
        if (originalUrl.indexOf(availableApis[i]) === 1) {
            return availableApis[i];
        }
    }
}

module.exports = ServerAjax;

// ----------------------------------------------------------------------------
// Copyright (C) 2017 Bloomberg Finance L.P.
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
