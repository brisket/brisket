"use strict";

var express = require("express");
var App = require("../application/App");
var ServerDispatcher = require("../server/ServerDispatcher");
var ServerResponseWorkflow = require("./ServerResponseWorkflow");
var DomainLocalStorage = require("./DomainLocalStorage");
var Cookies = require("../cookies/Cookies");
var ForwardClientRequest = require("./ForwardClientRequest");
var ServerInitializer = require("./ServerInitializer");
var Deprecated = require("../util/Deprecated");
var RedirectOnNewLayout = require("../controlling/RedirectOnNewLayout");

var Server = {

    create: function(requestedConfig) {
        var brisketEngine = express();

        var config = requestedConfig || {};
        var apis = config.apis || {};
        var environmentConfig = config.environmentConfig || {};
        var serverConfig = config.serverConfig || {};
        var onRouteHandled = config.onRouteHandled;
        var appRoot = environmentConfig.appRoot;
        var debug = config.debug === true;
        var redirectOnNewLayout = config.redirectOnNewLayout === true;

        Deprecated.message(
            "Accessing Brisket.Testing from require('brisket').Testing is " +
            "deprecated. require('brisket').Testing will be removed in the next " +
            "major release. Use require('brisket/testing') instead",
            "https://github.com/bloomberg/brisket/blob/master/docs/brisket.testing.md"
        );

        Deprecated.message(
            "Brisket.createServer({ redirectOnNewLayout: false }) is deprecated. " +
            "Brisket will always do a full redirect when a route uses a different " +
            "Layout in the next major release."
        );

        Deprecated.message(
            "Brisket.ErrorViewMapping.create is deprecated. Instead use a plain object. " +
            "Brisket.ErrorViewMapping will be removed in the next major release",
            "https://github.com/bloomberg/brisket/blob/master/docs/brisket.router.md"
        );

        Deprecated.message(
            "Brisket.Layout.prototype.environmentConfig is deprecated and it will be " +
            "removed in the next major release. Instead use the Layout's model - this.model",
            "https://github.com/bloomberg/brisket/blob/master/docs/brisket.layout.md#using-environment-config-in-template"
        );

        Deprecated.message(
            "Brisket.Layout.Metatags, Brisket.Layout.prototype.defaultTitle, and Brisket's " +
            "handling metatags and title tag are deprecated. These features and tools will " +
            "be removed in the next major release",
            "https://github.com/bloomberg/brisket/blob/master/docs/brisket.layout.md#setting-a-default-page-title"
        );

        verifyAppRoot(appRoot);
        verifyApis(apis);

        serverConfig.apis = apis;

        App.prependInitializer(function(options) {
            ServerInitializer.forApp(options);
        });

        App.initialize({
            environmentConfig: environmentConfig,
            serverConfig: serverConfig
        });

        if (debug) {
            environmentConfig.debug = true;
        }

        brisketEngine.use(DomainLocalStorage.middleware);

        Object.keys(apis).forEach(function(apiAlias) {
            var apiConfig = apis[apiAlias];
            brisketEngine.use("/" + apiAlias, ForwardClientRequest.toApi(apiConfig, apiAlias));
        });

        brisketEngine.get(
            "*",
            sendResponseFromApp(
                environmentConfig,
                onRouteHandled,
                redirectOnNewLayout
            )
        );

        return brisketEngine;
    },

    sendResponseFromApp: sendResponseFromApp

};

function sendResponseFromApp(environmentConfig, onRouteHandled, redirectOnNewLayout) {
    return function(expressRequest, expressResponse, next) {
        var fragment = expressRequest.path.slice(1);

        Cookies.letClientKnowIfAvailable(environmentConfig, expressRequest);
        RedirectOnNewLayout.letClientKnowIfShould(environmentConfig, redirectOnNewLayout);

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

function verifyAppRoot(appRoot) {
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
}

function verifyApis(apis) {
    Object.keys(apis).forEach(function(apiAlias) {
        var apiConfig = apis[apiAlias];

        if (!apiConfig || typeof apiConfig.host !== "string") {
            throw new Error("The host for " + apiAlias + " in apis config must be a string.");
        }
    });
}

module.exports = Server;

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
