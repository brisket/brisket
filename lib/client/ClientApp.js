"use strict";

var App = require("../application/App");
var SetupLinksAndPushState = require("./SetupLinksAndPushState");
var BootstrappedDataService = require("./BootstrappedDataService");
var Syncing = require("../modeling/Syncing");
var qualifyUrlWithAppRoot = require("../util/qualifyUrlWithAppRoot");
var ClientRenderingWorkflow = require("../client/ClientRenderingWorkflow");
var ClientResponse = require("../client/ClientResponse");
var ViewsFromServer = require("../viewing/ViewsFromServer");

var ClientApp = App.extend({

    start: function(options) {
        options = options || {};
        var environmentConfig = options.environmentConfig || {};
        var bootstrappedData = options.bootstrappedData || {};
        var bootstrappedDataService = new BootstrappedDataService(bootstrappedData);
        var appRoot = environmentConfig.appRoot;

        // Eric Herdzik 09/04/2014
        // Qualify URL with app root BEFORE checking bootstrapped data
        // Bootstrapped data keys contain the appRoot, e.g.
        // {
        //     "/approot/api/articles/1": {...}
        // }
        if (appRoot) {
            Syncing.beforeSync(qualifyUrlWithAppRoot(appRoot));
        }

        Syncing.beforeSync(bootstrappedDataService.checkAlreadyHasData);

        ClientRenderingWorkflow.setEnvironmentConfig(environmentConfig);
        ClientResponse.setAppRoot(appRoot);

        ViewsFromServer.initialize();

        var clientApp = this;

        /* wawjr3d 3/24/2016
         * Wrap Backbone history start in set timeout so it moves to back
         * of run loop. This is a quick fix for 0.x race condition where
         * consuming application has ClientApp that needs to configure the
         * first route but the first route has already started. This race
         * condition has already been fixed in brisket 1.x
         */
        setTimeout(function() {
            SetupLinksAndPushState.start({
                root: appRoot || "",
                browserSupportsPushState: clientApp.isPushStateAvailable()
            });
        }, 0);

        window.Brisket = window.Brisket || {};
        window.Brisket.version = require("../brisket").version;
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
