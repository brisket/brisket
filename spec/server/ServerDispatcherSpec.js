"use strict";

describe("ServerDispatcher", function() {
    var ServerDispatcher = require("../../lib/server/ServerDispatcher");
    var ServerRouter = require("../../lib/server/ServerRouter");

    var ExampleServerRouter;
    var mockRequest;
    var mockEnvironmentConfig;
    var mockClientAppRequirePath;
    var routeHandler;
    var handledRoute;
    var mockServerRenderingWorkflowResponse;

    beforeEach(function() {
        ServerDispatcher.reset();

        mockRequest = {};
        mockEnvironmentConfig = {};
        mockClientAppRequirePath = "some/path";

        mockServerRenderingWorkflowResponse = {
            html: "content"
        };

        routeHandler = jasmine.createSpy("routeHandler")
            .and.returnValue(mockServerRenderingWorkflowResponse);

        ExampleServerRouter = ServerRouter.extend({

            routes: {
                "route/:param": "routeHandler"
            },

            routeHandler: routeHandler

        });
    });

    afterEach(function() {
        ServerDispatcher.reset();
    });

    describe("#dispatch", function() {

        describe("when requested route had been added", function() {

            beforeEach(function() {
                new ExampleServerRouter();

                handledRoute = ServerDispatcher.dispatch(
                    "route/1",
                    mockRequest,
                    mockEnvironmentConfig,
                    mockClientAppRequirePath
                );
            });

            it("executes the matched handler with params", function() {
                // the extra null parameter is passed by Backbone v1.1.2
                var expectedParams = ["1", null];

                expect(routeHandler).toHaveBeenCalledWith(
                    expectedParams,
                    mockRequest,
                    mockEnvironmentConfig,
                    mockClientAppRequirePath
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

        describe("when requested route has NOT been added", function() {

            beforeEach(function() {
                handledRoute = ServerDispatcher.dispatch(
                    "notroute",
                    mockRequest,
                    mockEnvironmentConfig,
                    mockClientAppRequirePath
                );
            });

            it("does NOT execute a handler", function() {
                expect(routeHandler).not.toHaveBeenCalled();
            });

            it("returns null", function() {
                expect(handledRoute).toBeNull();
            });

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
