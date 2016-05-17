"use strict";

describe("ClientApp", function() {
    var App = require("lib/application/App");
    var ClientApp = require("lib/client/ClientApp");
    var Backbone = require("lib/application/Backbone");
    var SetupLinksAndPushState = require("lib/client/SetupLinksAndPushState");
    var ClientRenderingWorkflow = require("lib/client/ClientRenderingWorkflow");
    var ViewsFromServer = require("lib/viewing/ViewsFromServer");

    var clientApp;
    var callOrder;

    beforeEach(function() {
        callOrder = [];
        clientApp = new ClientApp();

        spyOn(SetupLinksAndPushState, "start").and.callFake(function() {
            callOrder.push("SetupLinksAndPushState.start");
        });

        spyOn(ClientRenderingWorkflow, "setEnvironmentConfig").and.callFake(function() {
            callOrder.push("ClientRenderingWorkflow.setEnvironmentConfig");
        });

        spyOn(ViewsFromServer, "initialize").and.callFake(function() {
            callOrder.push("ViewsFromServer.initialize");
        });
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
            expectLastCallToBe("SetupLinksAndPushState.start");
        });

        it("initializes views from server", function() {
            expect(ViewsFromServer.initialize).toHaveBeenCalled();
        });

    });

    describe("when environmentConfig is passed to start", function() {

        beforeEach(function() {
            clientApp.start({
                environmentConfig: {
                    "made": "in client app spec"
                }
            });
        });

        it("sets environment config for client rendering to be passed environmentConfig", function() {
            expect(ClientRenderingWorkflow.setEnvironmentConfig)
                .toHaveBeenCalledWith({
                    "made": "in client app spec"
                });
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
            expect(SetupLinksAndPushState.start.calls.mostRecent().args[0])
                .toHaveKeyValue("root", "/appRoot");
        });

    });

    describe("when appRoot is NOT passed in config", function() {

        beforeEach(function() {
            clientApp.start();
        });

        it("sets up links and push state with appRoot from configuration", function() {
            expect(SetupLinksAndPushState.start.calls.mostRecent().args[0])
                .toHaveKeyValue("root", "");
        });

    });

    describe("when push state is available", function() {

        beforeEach(function() {
            spyOn(clientApp, "isPushStateAvailable").and.returnValue(true);
            clientApp.start();
        });

        it("sets up links and push state with appRoot from configuration", function() {
            expect(SetupLinksAndPushState.start.calls.mostRecent().args[0])
                .toHaveKeyValue("browserSupportsPushState", true);
        });

    });

    describe("when push state is NOT available", function() {

        beforeEach(function() {
            spyOn(clientApp, "isPushStateAvailable").and.returnValue(false);
            clientApp.start();
        });

        it("sets up links and push state with appRoot from configuration", function() {
            expect(SetupLinksAndPushState.start.calls.mostRecent().args[0])
                .toHaveKeyValue("browserSupportsPushState", false);
        });

    });

    describe("when there is a SubClass of ClientApp", function() {
        var MyClientApp;

        beforeEach(function() {
            MyClientApp = ClientApp.extend();
            clientApp = new MyClientApp();
        });

        it("sets up links and push state last when it starts", function() {
            clientApp.start();
            expect(SetupLinksAndPushState.start).toHaveBeenCalled();
            expectLastCallToBe("SetupLinksAndPushState.start");
        });

    });

    function expectLastCallToBe(what) {
        expect(callOrder.pop()).toBe(what);
    }

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
