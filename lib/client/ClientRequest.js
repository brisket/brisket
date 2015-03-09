"use strict";

var constructQualifiedUrl = require("../util/constructQualifiedUrl");
var qs = require("qs");
var Cookies = require("../cookies/Cookies");
var cookie = require("cookie");

var previousRequest;
var previousCookies;
var cachedParsedCookies;
var fromLinkClick = false;

var LENGTH_OF_LEADING_SLASH = "/".length;

var ClientRequest = {

    from: function(windough, requestId, environmentConfig) {
        environmentConfig = environmentConfig || {};

        var protocol = windough.location.protocol;
        var querystring = windough.location.search.substr(1);
        var isFirstRequest = requestId < 2;
        var windowPath = windough.location.pathname;
        var appRoot = environmentConfig.appRoot || "";

        return {
            host: windough.location.host,
            path: windowPath,
            applicationPath: windowPath.substring(appRoot.length + LENGTH_OF_LEADING_SLASH),
            protocol: protocol.substring(0, protocol.length - 1),
            query: qs.parse(querystring),
            rawQuery: querystring,
            referrer: getReferrerFromPreviousRequest() || windough.document.referrer,
            userAgent: windough.navigator.userAgent,
            isFirstRequest: requestId < 2,
            requestId: requestId,
            isNotClick: !isFirstRequest && notFromLinkClick(),
            environmentConfig: environmentConfig,
            cookies: calculateCookiesFrom(windough, environmentConfig)
        };
    },

    setPreviousRequest: function(request) {
        previousRequest = request;
    },

    isFromLinkClick: function() {
        fromLinkClick = true;
    },

    reset: function() {
        previousRequest = null;
        fromLinkClick = false;
        previousCookies = null;
        cachedParsedCookies = null;
    }

};

function getReferrerFromPreviousRequest() {
    if (!previousRequest) {
        return null;
    }

    return constructQualifiedUrl(previousRequest);
}

function notFromLinkClick() {
    var couldBeBack = !fromLinkClick;

    fromLinkClick = false;

    return couldBeBack;
}

function calculateCookiesFrom(windough, environmentConfig) {
    if (!Cookies.areAvailable(environmentConfig)) {
        return null;
    }

    var currentCookies = windough.document.cookie;

    if (currentCookies === previousCookies) {
        return cachedParsedCookies;
    }

    previousCookies = currentCookies;
    cachedParsedCookies = cookie.parse(currentCookies);

    return cachedParsedCookies;
}

module.exports = ClientRequest;

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
