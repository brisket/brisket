"use strict";

describe("ClientInitializer", function() {
    var ClientInitializer = require("../../../lib/client/ClientInitializer");
    var ClientRenderingWorkflow = require("../../../lib/client/ClientRenderingWorkflow");
    var ClientAjax = require("../../../lib/client/ClientAjax");
    var ViewsFromServer = require("../../../lib/viewing/ViewsFromServer");

    var bootstrappedData;

    beforeEach(function() {
        bootstrappedData = {};

        spyOn(ClientAjax, "setup");
        spyOn(ClientRenderingWorkflow, "setEnvironmentConfig");
        spyOn(ViewsFromServer, "initialize");
    });

    describe("when it runs", function() {

        beforeEach(function() {
            ClientInitializer.forApp(validOptions());
        });

        it("initializes views from server", function() {
            expect(ViewsFromServer.initialize).toHaveBeenCalled();
        });

        it("sets up ClientAjax", function() {
            expect(ClientAjax.setup).toHaveBeenCalledWith(bootstrappedData, "/appRoot");
        });

    });

    describe("when environmentConfig is passed in config", function() {

        beforeEach(function() {
            ClientInitializer.forApp({
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

    function validOptions() {
        return {
            bootstrappedData: bootstrappedData,
            environmentConfig: {
                appRoot: "/appRoot"
            }
        };
    }

});

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
