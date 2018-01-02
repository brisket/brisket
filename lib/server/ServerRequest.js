"use strict";

var noop = require("../util/noop");

var LENGTH_OF_LEADING_SLASH = "/".length;

var ServerRequest = {

    from: function(expressRequest, environmentConfig) {
        environmentConfig = environmentConfig || {};
        var rawQuery = getRawQuery(expressRequest.originalUrl);
        var appRoot = environmentConfig.appRoot || "";
        var applicationPath = expressRequest.path;

        return {
            host: expressRequest.headers.host,
            hostname: expressRequest.hostname,
            path: appRoot + applicationPath,
            applicationPath: applicationPath.substring(LENGTH_OF_LEADING_SLASH),
            protocol: expressRequest.protocol,
            query: expressRequest.query,
            rawQuery: rawQuery,
            referrer: expressRequest.headers["referer"],
            userAgent: expressRequest.headers["user-agent"],
            isFirstRequest: true,
            requestId: 1,
            isNotClick: false,
            environmentConfig: environmentConfig,
            cookies: expressRequest.cookies || null,
            onComplete: noop,
            complete: noop
        };
    }
};

function getRawQuery(originalUrl) {

    if (typeof originalUrl !== "string") {
        return null;
    }

    return originalUrl.split("?")[1] || null;
}

module.exports = ServerRequest;

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
