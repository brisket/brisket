"use strict";

describe("ServerApp", function() {
    var ServerApp = require("../../lib/server/ServerApp");
    var App = require("../../lib/application/App");
    var ServerDispatcher = require("../../lib/server/ServerDispatcher");
    var ServerAjax = require("../../lib/server/ServerAjax");
    var ServerResponse = require("../../lib/server/ServerResponse");
    var Backbone = require("../../lib/application/Backbone");

    var serverApp;
    var fragment;
    var mockRequest;
    var environmentConfig;
    var clientAppRequirePath;
    var apis;
    var serverConfig;

    beforeEach(function() {
        serverApp = new ServerApp();
    });

    it("is a type of App", function() {
        expect(serverApp instanceof App).toBe(true);
    });

    describe("#dispatch", function() {

        beforeEach(function() {
            fragment = "route";
            mockRequest = {};
            environmentConfig = {
                some: "option"
            };
            clientAppRequirePath = "app/ClientApp";

            spyOn(ServerDispatcher, "dispatch");

            serverApp.dispatch(fragment, mockRequest, environmentConfig, clientAppRequirePath);
        });

        it("tells the server dispatcher to dispatch", function() {
            expect(ServerDispatcher.dispatch).toHaveBeenCalled();
        });

        it("passes the fragment, host and environmentConfig to server dispatcher", function() {
            expect(ServerDispatcher.dispatch).toHaveBeenCalledWith(
                fragment,
                mockRequest,
                environmentConfig,
                clientAppRequirePath
            );
        });

    });

    it("can be extended", function() {
        expect(ServerApp.extend().toString()).toEqual(Backbone.History.extend().toString());
    });

    describe("when it starts", function() {

        beforeEach(function() {
            apis = {};
            serverConfig = {
                apis: apis
            };
            environmentConfig = {
                appRoot: "/root"
            };

            spyOn(ServerAjax, "setup");
            spyOn(ServerResponse, "setAppRoot");

            serverApp.start({
                serverConfig: serverConfig,
                environmentConfig: environmentConfig
            });
        });

        it("sets up server ajax", function() {
            expect(ServerAjax.setup).toHaveBeenCalledWith(apis);
        });

        it("sets app root for server response", function() {
            expect(ServerResponse.setAppRoot).toHaveBeenCalledWith("/root");
        });

    });

});

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
