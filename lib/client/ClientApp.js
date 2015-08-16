"use strict";

import App from "../application/App";
import SetupLinksAndPushState from "./SetupLinksAndPushState";
import BootstrappedDataService from "./BootstrappedDataService";
import Syncing from "../modeling/Syncing";
import qualifyUrlWithAppRoot from "../util/qualifyUrlWithAppRoot";
import ClientRenderingWorkflow from "../client/ClientRenderingWorkflow";
import ClientResponse from "../client/ClientResponse";
import ViewsFromServer from "../viewing/ViewsFromServer";

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

        // Wayne Warner 12/28/2014 start Backbone history last to ensure
        //  all routers and environment variables have been set up before
        //  any routes execute
        SetupLinksAndPushState.start({
            root: appRoot || "",
            browserSupportsPushState: this.isPushStateAvailable()
        });

        window.Brisket = {
            version: require("../brisket").version
        };
    },

    isPushStateAvailable: function() {
        return !!(window.history && window.history.pushState);
    }

});

export default ClientApp;

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
