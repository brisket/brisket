"use strict";

var ClientAjax = require("../client/ClientAjax");
var ClientRenderingWorkflow = require("../client/ClientRenderingWorkflow");
var ViewsFromServer = require("../viewing/ViewsFromServer");
var Response = require("../controlling/Response");

var ClientInitializer = {

    forApp: function initializeAppOnClient(options) {
        var environmentConfig = options.environmentConfig || {};
        var bootstrappedData = options.bootstrappedData || {};
        var appRoot = environmentConfig.appRoot;

        ClientAjax.setup(bootstrappedData, appRoot);

        ClientRenderingWorkflow.setEnvironmentConfig(environmentConfig);
        Response.setAppRoot(appRoot);

        ViewsFromServer.initialize();

        window.Brisket = window.Brisket || {};
        window.Brisket.version = require("../brisket").version;
    }

};

module.exports = ClientInitializer;

// ----------------------------------------------------------------------------
// Copyright (C) 2018 Bloomberg Finance L.P.
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
