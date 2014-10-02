"use strict";

var constructQualifiedUrl = require("../util/constructQualifiedUrl");
var qs = require("qs");

var previousRequest;
var fromLinkClick = false;

var ClientRequest = {

    from: function(windough, requestId) {
        var protocol = windough.location.protocol;
        var querystring = windough.location.search.substr(1);
        var isFirstRequest = requestId < 2;

        return {
            host: windough.location.host,
            path: windough.location.pathname,
            protocol: protocol.substring(0, protocol.length - 1),
            query: qs.parse(querystring),
            referrer: getReferrerFromPreviousRequest() || windough.document.referrer,
            userAgent: windough.navigator.userAgent,
            isFirstRequest: requestId < 2,
            requestId: requestId,
            isNotClick: !isFirstRequest && notFromLinkClick()
        };
    },

    setPreviousRequest: function(request) {
        previousRequest = request;
    },

    isFromLinkClick: function() {
        fromLinkClick = true;
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

module.exports = ClientRequest;

// ----------------------------------------------------------------------------
// Copyright (C) 2014 Bloomberg L.P.
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
