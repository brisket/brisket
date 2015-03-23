"use strict";

var $ = require("../application/jquery");
var Backbone = require("../application/Backbone");
var AjaxCallsForCurrentRequest = require("./AjaxCallsForCurrentRequest");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var ServerConfigure = {

    configureJquery: function() {
        $.support.cors = true;
        $.ajaxSettings.xhr = function() {
            return new XMLHttpRequest();
        };
    },

    recordAjaxCallsForBootstrapping: function(appRoot) {
        var originalBackboneAjax = Backbone.ajax;

        Backbone.ajax = function(ajaxRequest) {
            var url = ajaxRequest.originalUrl || ajaxRequest.url;
            var queryParams = ajaxRequest.data;

            return originalBackboneAjax.apply(this, arguments)
                .then(function(data) {
                    if (appRoot) {
                        url = appRoot + url;
                    }

                    AjaxCallsForCurrentRequest.record(url, queryParams, data);

                    return data;
                });
        };
    }

};

module.exports = ServerConfigure;

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
