"use strict";

var $ = require("../application/jquery");
var calculateSyncRequestUrl = require("../util/calculateSyncRequestUrl");

var BootstrappedDataService = function(bootstrappedData) {
    this.bootstrappedData = bootstrappedData;
    this.mockjaxIds = {};
    this.checkAlreadyHasData = this.checkAlreadyHasData.bind(this);
};

BootstrappedDataService.prototype = {

    bootstrappedData: null,
    mockjaxIds: null,

    checkAlreadyHasData: function(method, model, options) {
        // TODO: move this require out to the top of the file.
        //  It is in this function because the node server claims
        //  that it can't find jquery-mockjax even though I
        //  npm installed it. WWARNER (5/12/2014)
        require("jquery-mockjax");

        if (!this.bootstrappedData) {
            return;
        }

        var url = calculateSyncRequestUrl(model, options);
        var bootstrappedDataForUrl = this.bootstrappedData[url];

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
