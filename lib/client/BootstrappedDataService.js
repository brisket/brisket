"use strict";

var bootstrappedData;
var bootstrappedFieldsRemaining = 0;

var BootstrappedDataService = {

    load: function(startBootstrappedData) {
        bootstrappedData = startBootstrappedData;

        if (bootstrappedData) {
            bootstrappedFieldsRemaining = Object.keys(bootstrappedData).length;
        }
    },

    getFor: function(ajaxConfig) {
        if (!bootstrappedFieldsRemaining || !ajaxConfig) {
            return;
        }

        var key = BootstrappedDataService.computeKey(ajaxConfig.url, ajaxConfig.data);
        var bootstrappedDataForUrl = bootstrappedData[key];

        if (bootstrappedDataForUrl) {
            bootstrappedData[key] = undefined;
        }

        bootstrappedFieldsRemaining = bootstrappedFieldsRemaining - 1;

        return bootstrappedDataForUrl;
    },

    computeKey: function(url, queryParams) {
        if (queryParams) {
            return url + encodeURIComponent(JSON.stringify(queryParams));
        }

        return url;
    },

    clear: function() {
        bootstrappedData = undefined;
        bootstrappedFieldsRemaining = 0;
    }

};

module.exports = BootstrappedDataService;

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
