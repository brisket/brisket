"use strict";

var App = require("../application/App");
var ServerDispatcher = require("../server/ServerDispatcher");
var Syncing = require("../modeling/Syncing");
var prepareForApiHost = require("./prepareForApiHost");
var ServerConfigure = require("./ServerConfigure");
var ServerResponse = require("./ServerResponse");
var saveOriginalUrl = require("./saveOriginalUrl");

var ServerApp = App.extend({

    start: function(options) {
        var serverConfig = options.serverConfig;
        var appRoot = options.environmentConfig.appRoot;

        ServerConfigure.configureJquery();
        ServerConfigure.recordAjaxCallsForBootstrapping(appRoot);

        Syncing.beforeSync(saveOriginalUrl);
        Syncing.beforeSync(prepareForApiHost(serverConfig.apiHost));

        ServerResponse.setAppRoot(appRoot);
    },

    dispatch: function(fragment, expressRequest, environmentConfig, clientAppRequirePath) {
        return ServerDispatcher.dispatch(fragment, expressRequest, environmentConfig, clientAppRequirePath);
    }

});

module.exports = ServerApp;

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
