"use strict";

var App = require("lib/application/App");
var ClientApp = require("lib/client/ClientApp");
var Backbone = require("lib/application/Backbone");
var SetupLinksAndPushState = require("lib/client/SetupLinksAndPushState");

describe("ClientApp", function() {
    var clientApp;

    beforeEach(function() {
        clientApp = new ClientApp();

        spyOn(SetupLinksAndPushState, "start");
    });

    it("is a type of App", function() {
        expect(clientApp instanceof App).toBe(true);
    });

    it("can be extended", function() {
        expect(ClientApp.extend().toString()).toEqual(Backbone.History.extend().toString());
    });

    it("starts without config", function() {
        var startingClientAppWithoutConfig = function() {
            clientApp.start();
        };

        expect(startingClientAppWithoutConfig).not.toThrow();
    });

    describe("when it starts", function() {

        beforeEach(function() {
            clientApp.start();
        });

        it("sets up links and push state", function() {
            expect(SetupLinksAndPushState.start).toHaveBeenCalled();
        });

    });

    describe("when appRoot is passed in config", function() {

        beforeEach(function() {
            clientApp.start({
                environmentConfig: {
                    appRoot: "/appRoot"
                }
            });
        });

        it("sets up links and push state with appRoot from configuration", function() {
            expect(SetupLinksAndPushState.start.mostRecentCall.args[0])
                .toHaveKeyValue("root", "/appRoot");
        });

    });

    describe("when appRoot is NOT passed in config", function() {

        beforeEach(function() {
            clientApp.start();
        });

        it("sets up links and push state with appRoot from configuration", function() {
            expect(SetupLinksAndPushState.start.mostRecentCall.args[0])
                .toHaveKeyValue("root", "");
        });

    });

    describe("when push state is available", function() {

        beforeEach(function() {
            spyOn(clientApp, "isPushStateAvailable").andReturn(true);
            clientApp.start();
        });

        it("sets up links and push state with appRoot from configuration", function() {
            expect(SetupLinksAndPushState.start.mostRecentCall.args[0])
                .toHaveKeyValue("pushState", true);
        });

    });

    describe("when push state is NOT available", function() {

        beforeEach(function() {
            spyOn(clientApp, "isPushStateAvailable").andReturn(false);
            clientApp.start();
        });

        it("sets up links and push state with appRoot from configuration", function() {
            expect(SetupLinksAndPushState.start.mostRecentCall.args[0])
                .toHaveKeyValue("pushState", false);
        });

    });
});

// ----------------------------------------------------------------------------
// Copyright (C) 2014 Bloomberg L.P.
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
