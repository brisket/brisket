"use strict";

var Promise = require("bluebird");
var Errors = require("../errors/Errors");

var ServerResponseWorkflow = {

    sendResponseFor: function(whenContentIsReturned, expressResponse, next) {
        return Promise.resolve(whenContentIsReturned)
            .then(
                send(expressResponse),
                otherwiseSendErrorPage(expressResponse)
            )
            .caught(
                logAndSendUnhandleableError(expressResponse, next)
            );
    }

};

function send(expressResponse) {
    return function(responseForRoute) {
        var serverResponse = responseForRoute.serverResponse;

        expressResponse.set(serverResponse.headers);

        if (serverResponse.shouldRedirect()) {
            expressResponse.redirect(serverResponse.statusCode, serverResponse.redirectDestination);
            return;
        }

        expressResponse
            .status(serverResponse.statusCode)
            .send(responseForRoute.html);
    };
}

function otherwiseSendErrorPage(expressResponse) {
    return function(responseForRoute) {
        if (thereWasAnErrorServerAppCouldNOTHandle(responseForRoute)) {
            throw responseForRoute;
        }

        var serverResponse = responseForRoute.serverResponse;

        expressResponse
            .status(serverResponse.statusCode)
            .send(responseForRoute.html);
    };
}

function thereWasAnErrorServerAppCouldNOTHandle(responseForRoute) {
    return !responseForRoute.serverResponse;
}

function logAndSendUnhandleableError(expressResponse, next) {
    return function(error) {
        Errors.notify(error);
        next(error);
    };
}

module.exports = ServerResponseWorkflow;

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
