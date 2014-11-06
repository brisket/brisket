"use strict";

var Promise = require("bluebird");
var Errors = require("../errors/Errors");

var ServerResponseWorkflow = {

    sendResponseFor: function(whenContentIsReturned, response, next) {
        return Promise.resolve(whenContentIsReturned)
            .then(
                sendHtml(response),
                otherwiseSendErrorPage(response)
            )
            .caught(
                logAndSendUnrecoverableError(response, next)
            );
    }

};

function sendHtml(response) {
    return function(html) {
        response.send(html);
    };
}

function otherwiseSendErrorPage(response) {
    return function(errorResponse) {
        if (thereWasAnErrorServerAppCouldNOTHandle(errorResponse)) {
            throw errorResponse;
        }

        response.status(errorResponse.status).send(errorResponse.html);
    };
}

function thereWasAnErrorServerAppCouldNOTHandle(errorResponse) {
    return !errorResponse.status;
}

function logAndSendUnrecoverableError(response, next) {
    return function(error) {
        Errors.log(error);
        response.status(500);
        next();
    };
}

module.exports = ServerResponseWorkflow;

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
