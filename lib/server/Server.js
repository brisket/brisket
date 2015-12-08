"use strict";

var express = require("express");
var App = require("../application/App");
var ServerDispatcher = require("../server/ServerDispatcher");
var ServerResponseWorkflow = require("./ServerResponseWorkflow");
var DomainLocalStorage = require("./DomainLocalStorage");
var Cookies = require("../cookies/Cookies");
var Initializer = require("../application/Initializer");
var ServerInitializer = require("./ServerInitializer");

var Server = {

    create: function(requestedConfig) {
        var brisketEngine = express();

        var config = requestedConfig || {};
        var apiHost = config.apiHost;
        var environmentConfig = config.environmentConfig || {};
        var serverConfig = config.serverConfig || {};
        var onRouteHandled = config.onRouteHandled;
        var appRoot = environmentConfig.appRoot;

        if (appRoot && /\/$/.test(appRoot)) {
            throw new Error(
                "You must omit trailing slash when providing an appRoot"
            );
        }

        if (appRoot && !/^\//.test(appRoot)) {
            throw new Error(
                "You must include leading slash when providing an appRoot"
            );
        }

        if (typeof apiHost !== "string") {
            throw new Error(
                "You cannot create a server without passing " +
                "an apiHost to createServer."
            );
        }

        serverConfig.apiHost = apiHost;

        App.prependInitializer(function(options) {
            Initializer.forApp(options);
            ServerInitializer.forApp(options);
        });

        App.initialize({
            environmentConfig: environmentConfig,
            serverConfig: serverConfig
        });

        brisketEngine.use(DomainLocalStorage.middleware);
        brisketEngine.get(
            "*",
            sendResponseFromApp(
                environmentConfig,
                onRouteHandled
            )
        );

        return brisketEngine;
    },

    sendResponseFromApp: sendResponseFromApp

};

function sendResponseFromApp(environmentConfig, onRouteHandled) {
    return function(expressRequest, expressResponse, next) {
        var fragment = expressRequest.path.slice(1);

        Cookies.letClientKnowIfAvailable(environmentConfig, expressRequest);

        var handledRoute = ServerDispatcher.dispatch(
            fragment,
            expressRequest,
            environmentConfig
        );

        if (!handledRoute) {
            next();
            return;
        }

        if (typeof onRouteHandled === "function") {
            onRouteHandled({
                request: expressRequest,
                route: handledRoute.handler.rawRoute
            });
        }

        ServerResponseWorkflow.sendResponseFor(
            handledRoute.content,
            expressResponse,
            next
        );
    };
}

module.exports = Server;

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
