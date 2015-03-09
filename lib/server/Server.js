"use strict";

var express = require("express");
var ServerApp = require("./ServerApp");
var ServerResponseWorkflow = require("./ServerResponseWorkflow");
var DomainLocalStorage = require("./DomainLocalStorage");
var Cookies = require("../cookies/Cookies");

var Server = {

    create: function(config) {
        var brisketEngine = express();

        config = config || {};
        var clientAppRequirePath = config.clientAppRequirePath;
        var apiHost = config.apiHost;
        var environmentConfig = config.environmentConfig || {};
        var serverConfig = config.serverConfig || {};
        var onRouteHandled = config.onRouteHandled;
        var ServerAppToUse = config.ServerApp || ServerApp;
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

        if (typeof clientAppRequirePath != "string") {
            throw new Error(
                "You must specify the require path to your ClientApp - clientAppRequirePath"
            );
        }

        if (typeof apiHost != "string") {
            throw new Error("You cannot create a server without passing an apiHost to createServer.");
        }

        if (typeof ServerAppToUse != "function" || isNotASubclassOfServerApp(ServerAppToUse)) {
            throw new Error(
                "Brisket can only start a ServerApp. Please pass in a Brisket.ServerApp."
            );
        }

        var serverApp = new ServerAppToUse();

        serverConfig.apiHost = apiHost;

        serverApp.start({
            environmentConfig: environmentConfig,
            serverConfig: serverConfig
        });

        brisketEngine.use(DomainLocalStorage.middleware);
        brisketEngine.get(
            "*",
            sendResponseFromServerApp(serverApp, environmentConfig, clientAppRequirePath, onRouteHandled)
        );

        return brisketEngine;
    },

    sendResponseFromServerApp: sendResponseFromServerApp

};

function sendResponseFromServerApp(serverApp, environmentConfig, clientAppRequirePath, onRouteHandled) {
    return function(expressRequest, expressResponse, next) {
        var fragment = expressRequest.path.slice(1);

        Cookies.letClientKnowIfAvailable(environmentConfig, expressRequest);

        var handledRoute = serverApp.dispatch(
            fragment,
            expressRequest,
            environmentConfig,
            clientAppRequirePath
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

function isNotASubclassOfServerApp(ServerAppToUse) {
    return ServerAppToUse !== ServerApp &&
        !(ServerAppToUse.prototype instanceof ServerApp);
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
