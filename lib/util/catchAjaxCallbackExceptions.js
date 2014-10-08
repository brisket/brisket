"use strict";

var Promise = require("bluebird");

var CALLBACK_NAMES = [
    "success",
    "error",
    "complete"
];

function wrapCallbackWithErrorHandling(callback, renderError) {
    return function() {
        return Promise.method(callback).apply(null, arguments)
            .caught(function(e) {
                renderError(e);
            });
    };
}

function catchAjaxCallbackExceptions(method, model, options, returnData, renderError) {
    for (var i = 0, len = CALLBACK_NAMES.length; i < len; ++i) {
        var callbackName = CALLBACK_NAMES[i];
        var callback = options[callbackName];

        if (typeof callback !== "function") {
            return;
        }

        options[callbackName] = wrapCallbackWithErrorHandling(callback, renderError);
    }
}

module.exports = catchAjaxCallbackExceptions;

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
