"use strict";

var $ = require("../application/jquery");
var calculateSyncRequestUrl = require("../util/calculateSyncRequestUrl");

var BootstrappedDataService = function(bootstrappedData) {
    this.bootstrappedData = bootstrappedData;
    this.mockjaxIds = {};
    this.checkAlreadyHasData = this.checkAlreadyHasData.bind(this);
};

BootstrappedDataService.prototype = {

    checkAlreadyHasData: function(method, model, options) {
        require("jquery-mockjax");

        if (!this.bootstrappedData) {
            return;
        }

        var url = calculateSyncRequestUrl(model, options);
        var queryParams = options ? options.data : undefined;
        var key = BootstrappedDataService.computeKey(url, queryParams);
        var bootstrappedDataForUrl = this.bootstrappedData[key];

        if (!bootstrappedDataForUrl) {
            return;
        }

        var mockjaxIdForUrl = this.mockjaxIds[url];

        if (mockjaxIdForUrl !== undefined) {
            $.mockjaxClear(mockjaxIdForUrl);
            return;
        }

        this.mockjaxIds[url] = $.mockjax({
            url: url,
            contentType: "text/json",
            dataType: "json",
            status: 200,
            responseText: bootstrappedDataForUrl
        });
    },

    clearMockedData: function() {
        for (var id in this.mockjaxIds) {
            $.mockjaxClear(this.mockjaxIds[id]);
        }

        this.mockjaxIds = {};
    }

};

BootstrappedDataService.computeKey = function(url, queryParams) {
    if (queryParams) {
        return url + JSON.stringify(queryParams);
    }

    return url;
};

module.exports = BootstrappedDataService;

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
