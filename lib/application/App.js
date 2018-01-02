"use strict";

var Environment = require("../environment/Environment");
var onlyRunsOnClient = Environment.onlyRunsOnClient;
var SetupLinksAndPushState = require("../client/SetupLinksAndPushState");
var ClientInitializer = require("../client/ClientInitializer");
var Browser = require("../client/Browser");

var serverInitializers = [];
var clientInitializers = [];
var alreadyInitialized = false;
var started = false;
var initializeOptions;
var routersConfig;

var App = {

    useRouters: function(appRoutersConfig) {
        routersConfig = appRoutersConfig;
    },

    initialize: function(options) {
        if (alreadyInitialized) {
            return;
        }

        initializeOptions = options;

        if (Environment.isServer()) {
            run(serverInitializers);
        }

        if (Environment.isClient()) {
            run(clientInitializers);
        }

        initializeRouters(routersConfig);

        alreadyInitialized = true;
    },

    addInitializer: addTo(serverInitializers, clientInitializers),

    addServerInitializer: addTo(serverInitializers),

    addClientInitializer: addTo(clientInitializers),

    prependInitializer: prependTo(serverInitializers, clientInitializers),

    start: onlyRunsOnClient(function() {
        if (started) {
            return;
        }

        started = true;

        var Brisket = window.Brisket = window.Brisket || {};

        if (Brisket.startConfig) {
            startClient(Brisket.startConfig);
            return;
        }

        Object.defineProperty(Brisket, "startConfig", {
            set: function(startConfig) {
                startClient(startConfig);
            }
        });
    }),

    reset: function() {
        serverInitializers.length = 0;
        clientInitializers.length = 0;
        alreadyInitialized = false;
        initializeOptions = undefined;
        routersConfig = undefined;
        started = false;
    }

};

function startClient(startConfig) {
    App.prependInitializer(function(startConfig) {
        ClientInitializer.forApp(startConfig);
    });

    App.initialize(startConfig);

    // Wayne Warner 12/28/2014 start Backbone history last to ensure
    //  all routers and environment variables have been set up before
    //  any routes execute
    SetupLinksAndPushState.start({
        root: startConfig.environmentConfig.appRoot || "",
        browserSupportsPushState: Browser.hasPushState()
    });
}

function initializeRouters(routersConfig) {
    if (!routersConfig) {
        return;
    }

    var CatchAllRouter = routersConfig.CatchAllRouter;
    var routers = routersConfig.routers;

    if (CatchAllRouter) {
        new CatchAllRouter();
    }

    for (var i = 0, len = routers.length; i < len; i++) {
        new routers[i]();
    }
}

function run(initializers) {
    for (var i = 0, len = initializers.length; i < len; i++) {
        initializers[i](initializeOptions);
    }
}

function verify(initializer) {
    if (typeof initializer === "function") {
        return;
    }

    throw new Error("App initializers must be a function");
}

function addTo() {
    return to.call(null, "push", arguments[0], arguments[1]);
}

function prependTo() {
    return to.call(null, "push", arguments[0], arguments[1]);
}

function to(how) {
    var initializerGroups = [arguments[1], arguments[2]];

    return function(initializer) {
        verify(initializer);

        if (alreadyInitialized) {
            initializer(initializeOptions);
            return;
        }

        for (var i = 0, len = initializerGroups.length; i < len; i++) {
            if (!initializerGroups[i]) {
                continue;
            }

            initializerGroups[i][how](initializer);
        }
    };
}

module.exports = App;

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
