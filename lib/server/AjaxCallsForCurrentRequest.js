"use strict";

var DomainLocalStorage = require("./DomainLocalStorage");
var BootstrappedDataService = require("../client/BootstrappedDataService");

var RECORDED_AJAX_CALLS = "recordedAjaxCalls";

var AjaxCallsForCurrentRequest = {

    record: function(url, queryParams, data) {
        var recordedAjaxCalls = DomainLocalStorage.get(RECORDED_AJAX_CALLS) || {};
        var key = BootstrappedDataService.computeKey(url, queryParams);

        recordedAjaxCalls[key] = data;

        DomainLocalStorage.set(RECORDED_AJAX_CALLS, recordedAjaxCalls);
    },

    all: function() {
        return DomainLocalStorage.get(RECORDED_AJAX_CALLS);
    },

    clear: function() {
        DomainLocalStorage.set(RECORDED_AJAX_CALLS, null);
    }

};

module.exports = AjaxCallsForCurrentRequest;

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
