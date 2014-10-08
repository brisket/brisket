"use strict";

var calculateSyncRequestUrl = require("../util/calculateSyncRequestUrl");

function BootstrappedDataService(bootstrappedData) {
    this.bootstrappedData = bootstrappedData || {};
    this.isBootstrapped = this.isBootstrapped.bind(this);
}

BootstrappedDataService.prototype = {

    bootstrappedData: null,

    isBootstrapped: function(method, model, options, returnData) {
        if (method === "read") {
            var url = calculateSyncRequestUrl(model, options);
            var bootstrappedDataForUrl = this.dataFor(url);

            if (bootstrappedDataForUrl) {
                this.clearFor(url);
                returnData(bootstrappedDataForUrl);
            }
        }
    },

    dataFor: function(url) {
        return this.bootstrappedData[url];
    },

    clearFor: function(url) {
        delete this.bootstrappedData[url];
    },

    clearAll: function() {
        this.bootstrappedData = {};
    }

};

module.exports = BootstrappedDataService;

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
