"use strict";

var Response = require("../controlling/Response");

var DEFAULT_REDIRECT_STATUS = 302;

var ServerResponse = Response.extend({

    statusCode: 200,
    redirectDestination: null,
    headers: null,
    success: true,

    initialize: function() {
        this.headers = {};
    },

    status: function(statusCode) {
        this.statusCode = statusCode;
    },

    set: function(field, value) {
        if (!field) {
            return;
        }

        if (typeof field === "string") {
            this.headers[field] = value;
            return;
        }

        addAllFields(field, this.headers);
    },

    redirect: function(statusCode, destination) {
        if (arguments.length === 1) {
            destination = statusCode;
            statusCode = DEFAULT_REDIRECT_STATUS;
        }

        this.redirectDestination = Response.redirectDestinationFrom(destination);
        this.status(statusCode);

        throw Response.INTERRUPT_RENDERING;
    },

    shouldRedirect: function() {
        return !!this.redirectDestination;
    },

    fail: function() {
        this.success = false;
    },

    isSuccess: function() {
        return this.success;
    }

}, {
    create: function() {
        return new ServerResponse();
    }
});

function addAllFields(passedHeaders, headers) {
    var fields = Object.keys(passedHeaders);
    var currentField;

    for (var i = 0, len = fields.length; i < len; i++) {
        currentField = fields[i];

        headers[currentField] = passedHeaders[currentField];
    }
}

module.exports = ServerResponse;

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
