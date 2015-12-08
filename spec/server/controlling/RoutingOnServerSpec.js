"use strict";

describe("Routing on server", function() {
    var Router = require("../../../lib/controlling/Router");
    var ServerDispatcher = require("../../../lib/server/ServerDispatcher");
    var ServerRenderingWorkflow = require("../../../lib/server/ServerRenderingWorkflow");

    var mockRequest;
    var mockEnvironmentConfig;
    var routeHandler;
    var ExampleRouter;
    var router;
    var handledRoute;

    beforeEach(function() {
        spyOn(ServerRenderingWorkflow, "execute").and.returnValue({
            html: "content"
        });

        mockRequest = {};
        mockEnvironmentConfig = {};

        routeHandler = function() {};

        ExampleRouter = Router.extend({
            routes: {
                "route/:param": "routeHandler"
            },

            routeHandler: routeHandler
        });

        router = new ExampleRouter();
    });

    afterEach(function() {
        ServerDispatcher.reset();
    });

    describe("when route exists, ServerDispatcher", function() {

        beforeEach(function() {
            handledRoute = ServerDispatcher.dispatch(
                "route/1",
                mockRequest,
                mockEnvironmentConfig
            );
        });

        it("executes the matched handler with params", function() {
            // the extra null parameter is passed by Backbone v1.1.2+
            var expectedParams = ["1", null];

            expect(ServerRenderingWorkflow.execute).toHaveBeenCalledWith(
                router,
                routeHandler,
                expectedParams,
                mockRequest,
                mockEnvironmentConfig
            );
        });

        it("returns a descriptor", function() {
            expect(handledRoute).toEqual(jasmine.objectContaining({
                content: {
                    html: "content"
                }
            }));
        });

    });

    describe("when route does NOT exist, ServerDispatcher", function() {

        beforeEach(function() {
            handledRoute = ServerDispatcher.dispatch(
                "notroute",
                mockRequest,
                mockEnvironmentConfig
            );
        });

        it("does NOT execute a handler", function() {
            expect(ServerRenderingWorkflow.execute).not.toHaveBeenCalled();
        });

        it("returns null", function() {
            expect(handledRoute).toBeNull();
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
