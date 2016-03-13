"use strict";

var App = require("../application/App");
var SetupLinksAndPushState = require("./SetupLinksAndPushState");
var ClientAjax = require("../client/ClientAjax");
var ClientRenderingWorkflow = require("../client/ClientRenderingWorkflow");
var ClientResponse = require("../client/ClientResponse");
var ViewsFromServer = require("../viewing/ViewsFromServer");

var ClientApp = App.extend({

    constructor: function() {
        App.apply(this, arguments);

        var baseStart = this.start;

        /* wawjr3d 5/17/2016
         * Call finishStart after new ClientApp.start. This is a quick fix
         * for 0.x race condition where consuming application has ClientApp
         * that needs to configure the first route but the first route has
         * already started. This race condition has already been fixed in
         * brisket 1.x
         */
        this.start = function() {
            baseStart.apply(this, arguments);
            this.finishStart.apply(this, arguments);
        };

    },

    start: function(options) {
        options = options || {};
        var environmentConfig = options.environmentConfig || {};
        var bootstrappedData = options.bootstrappedData || {};
        var appRoot = environmentConfig.appRoot;

        ClientAjax.setup(bootstrappedData);

        ClientRenderingWorkflow.setEnvironmentConfig(environmentConfig);
        ClientResponse.setAppRoot(appRoot);

        ViewsFromServer.initialize();

        window.Brisket = window.Brisket || {};
        window.Brisket.version = require("../brisket").version;
    },

    finishStart: function(options) {
        options = options || {};
        var environmentConfig = options.environmentConfig || {};
        var appRoot = environmentConfig.appRoot;

        SetupLinksAndPushState.start({
            root: appRoot || "",
            browserSupportsPushState: this.isPushStateAvailable()
        });
    },

    isPushStateAvailable: function() {
        return !!(window.history && window.history.pushState);
    }

});

module.exports = ClientApp;

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
