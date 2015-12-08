"use strict";

describe("ServerInitializer", function() {
    var ServerInitializer = require("../../lib/server/ServerInitializer");
    var ServerConfigure = require("../../lib/server/ServerConfigure");
    var ServerResponse = require("../../lib/server/ServerResponse");

    beforeEach(function() {
        spyOn(ServerConfigure, "configureJquery");
        spyOn(ServerConfigure, "recordAjaxCallsForBootstrapping");
        spyOn(ServerResponse, "setAppRoot");

        ServerInitializer.forApp({
            environmentConfig: {
                appRoot: "root"
            },
            serverConfig: {
                apiHost: "http://api.example.com"
            }
        });
    });

    it("configures jquery", function() {
        expect(ServerConfigure.configureJquery).toHaveBeenCalled();
    });

    it("starts recording ajax calls", function() {
        expect(ServerConfigure.recordAjaxCallsForBootstrapping).toHaveBeenCalledWith("root");
    });

    it("sets server response approot", function() {
        expect(ServerResponse.setAppRoot).toHaveBeenCalledWith("root");
    });

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
