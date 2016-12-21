"use strict";

describe("Server", function() {
    var Server = require("../../lib/server/Server");
    var ServerResponseWorkflow = require("../../lib/server/ServerResponseWorkflow");
    var ServerDispatcher = require("../../lib/server/ServerDispatcher");
    var ServerInitializer = require("../../lib/server/ServerInitializer");
    var App = require("../../lib/application/App");
    var ForwardClientRequest = require("../../lib/server/ForwardClientRequest");
    var _ = require("underscore");

    beforeEach(function() {
        spyOn(ServerInitializer, "forApp");
    });

    afterEach(function() {
        App.reset();
    });

    describe("#create", function() {

        it("initializes server and initializes App", function() {
            Server.create(validConfig());

            expect(ServerInitializer.forApp).toHaveBeenCalled();
            expect(ServerInitializer.forApp.calls.count()).toBe(1);
        });

        it("adds a middleware for each api in apis configuration", function() {
            var apiMiddleware = jasmine.createSpy();
            var otherApiMiddleware = jasmine.createSpy();

            spyOn(ForwardClientRequest, "toApi").and.callFake(function(apiConfig) {
                if (apiConfig.host === "http://api.example.com") {
                    return apiMiddleware;
                }

                if (apiConfig.host === "http://other-api.example.com") {
                    return otherApiMiddleware;
                }
            });

            var brisketEngine = Server.create(validConfig());

            expectMiddlewareFor(brisketEngine, "api", apiMiddleware);
            expectMiddlewareFor(brisketEngine, "other-api", otherApiMiddleware);
        });

    });

    describe("apis", function() {

        it("does NOT throw when all apis have host", function() {
            function creatingServerWithValidApis() {
                Server.create(validConfig());
            }

            expect(creatingServerWithValidApis).not.toThrow();
        });

        it("throws if any api alias does NOT have a valid config", function() {
            function creatingServerWithApiWithInvalidConfig() {
                Server.create(validConfigWith({
                    apis: {
                        "api": "not a valid config"
                    }
                }));
            }

            expect(creatingServerWithApiWithInvalidConfig).toThrow();
        });

        it("throws if any api alias does NOT have a valid host", function() {
            function creatingServerWithApiWithInvalidHost() {
                Server.create(validConfigWith({
                    apis: {
                        "api": {
                            host: null
                        }
                    }
                }));
            }

            expect(creatingServerWithApiWithInvalidHost).toThrow();
        });

    });

    describe("environmentConfig", function() {
        var environmentConfig;

        function appRootWithTrailingSlash() {
            return Server.create(validConfigWith({
                environmentConfig: {
                    appRoot: "/bad/"
                }
            }));
        }

        function appRootWithoutLeadingSlash() {
            return Server.create(validConfigWith({
                environmentConfig: {
                    appRoot: "bad"
                }
            }));
        }

        it("is passed to initializers start method", function() {
            environmentConfig = {
                some: "data"
            };

            Server.create(validConfigWith({
                environmentConfig: environmentConfig
            }));

            expect(objectPassedToInitializeAppOnServer().environmentConfig)
                .toEqual(environmentConfig);
        });

        it("throws an error when appRoot has trailing slash", function() {
            expect(appRootWithTrailingSlash).toThrow();
        });

        it("throws an error when appRoot is missing leading slash", function() {
            expect(appRootWithoutLeadingSlash).toThrow();
        });

    });

    describe("serverConfig", function() {
        var serverConfig;

        beforeEach(function() {
            serverConfig = {
                some: "data"
            };

            Server.create(validConfigWith({
                serverConfig: serverConfig
            }));
        });

        it("it's properties are passed to server initializers start method", function() {
            expect(objectPassedToInitializeAppOnServer().serverConfig)
                .toHaveKeyValue("some", "data");
        });

        it("exposes apis to server initializers through serverConfig", function() {
            expect(objectPassedToInitializeAppOnServer().serverConfig["apis"]).toEqual({
                "api": {
                    host: "http://api.example.com"
                },
                "other-api": {
                    host: "http://other-api.example.com"
                }
            });
        });

    });

    describe("#sendResponseFromApp", function() {
        var middleware;
        var environmentConfig;
        var mockRequest;
        var mockResponse;
        var mockNext;
        var mockServerResponse;
        var mockCallback;

        beforeEach(function() {
            environmentConfig = {};
            middleware = Server.sendResponseFromApp(environmentConfig);

            mockRequest = {
                path: "/aRoute",
                headers: {
                    host: "http://www.example.com:8080"
                }
            };

            mockResponse = {};
            mockNext = jasmine.createSpy();

            spyOn(ServerDispatcher, "dispatch");
            spyOn(ServerResponseWorkflow, "sendResponseFor");
        });

        it("lets client app know when server does NOT have cookies", function() {
            middleware(mockRequest, mockResponse, mockNext);
            expect(environmentConfig["brisket:wantsCookies"]).toBe(false);
        });

        it("lets client app know when server has cookies", function() {
            mockRequest.cookies = {};
            middleware(mockRequest, mockResponse, mockNext);
            expect(environmentConfig["brisket:wantsCookies"]).toBe(true);
        });

        it("[deprecated] lets client app know if it should NOT redirect on new layout", function() {
            middleware = Server.sendResponseFromApp(environmentConfig, null, false);
            middleware(mockRequest, mockResponse, mockNext);
            expect(environmentConfig["brisket:layoutRedirect"]).toBe(false);
        });

        it("[deprecated] lets client app know if it should redirect on new layout", function() {
            middleware = Server.sendResponseFromApp(environmentConfig, null, true);
            middleware(mockRequest, mockResponse, mockNext);
            expect(environmentConfig["brisket:layoutRedirect"]).toBe(true);
        });

        it("dispatches to server app with leading slash of request path stripped", function() {
            middleware(mockRequest, mockResponse, mockNext);
            expect(ServerDispatcher.dispatch.calls.mostRecent().args[0]).toBe("aRoute");
        });

        it("dispatches to server app with request host", function() {
            middleware(mockRequest, mockResponse, mockNext);
            expect(ServerDispatcher.dispatch.calls.mostRecent().args[1]).toBe(mockRequest);
        });

        it("dispatches to server app with client config", function() {
            middleware(mockRequest, mockResponse, mockNext);
            expect(ServerDispatcher.dispatch.calls.mostRecent().args[2]).toBe(environmentConfig);
        });

        describe("when app CANNOT handle a request", function() {

            beforeEach(function() {
                ServerDispatcher.dispatch.and.returnValue(null);
            });

            it("forwards onto next middleware", function() {
                middleware(mockRequest, mockResponse, mockNext);
                expect(mockNext).toHaveBeenCalled();
            });

            it("does NOT send server app response", function() {
                middleware(mockRequest, mockResponse, mockNext);
                expect(ServerResponseWorkflow.sendResponseFor).not.toHaveBeenCalled();
            });

        });

        describe("when app CAN handle a request", function() {

            beforeEach(function() {
                ServerDispatcher.dispatch.and.returnValue({
                    content: "html"
                });
            });

            it("sends app response", function() {
                middleware(mockRequest, mockResponse, mockNext);
                expect(ServerResponseWorkflow.sendResponseFor)
                    .toHaveBeenCalledWith("html", mockResponse, mockNext);
            });

        });

        describe("onRouteHandled", function() {

            beforeEach(function() {
                mockServerResponse = {
                    content: "html",
                    handler: {
                        rawRoute: "rawRoute"
                    }
                };

                ServerDispatcher.dispatch.and.returnValue(mockServerResponse);
            });

            describe("when a server response callback handler is passed in", function() {

                beforeEach(function() {
                    mockCallback = jasmine.createSpy("mockCallback");

                    middleware = Server.sendResponseFromApp(
                        environmentConfig,
                        mockCallback
                    );

                    middleware(mockRequest, mockResponse, mockNext);
                });

                it("fires the callback with the request and the actual route", function() {
                    expect(mockCallback).toHaveBeenCalledWith({
                        request: mockRequest,
                        route: mockServerResponse.handler.rawRoute
                    });
                });

            });

            describe("when NO server response callback handler is passed in", function() {

                beforeEach(function() {
                    middleware = Server.sendResponseFromApp(
                        environmentConfig,
                        mockRequest.path,
                        null
                    );
                });

                it("doesn't not error out", function() {
                    expect(function() {
                        middleware(mockRequest, mockResponse, mockNext);
                    }).not.toThrow();
                });

            });
        });

    });

    function validConfig() {
        return {
            apis: {
                "api": {
                    host: "http://api.example.com"
                },
                "other-api": {
                    host: "http://other-api.example.com"
                }
            }
        };
    }

    function validConfigWith(customSettings) {
        return _.extend(validConfig(), customSettings);
    }

    function objectPassedToInitializeAppOnServer() {
        return ServerInitializer.forApp.calls.mostRecent().args[0];
    }

    function expectMiddlewareFor(brisketEngine, api, middleware) {
        var expressLayers = brisketEngine._router.stack;
        var matched = {};

        for (var i = expressLayers.length - 1; i !== 0; i--) {
            var expressLayer = expressLayers[i];
            var regexp = expressLayer.regexp;

            if (matched[api]) {
                throw new Error("expected ONLY 1 middleware for " + api + " on brisketEngine");
            }

            if (
                regexp.test("/" + api + "/path/to/data") &&
                !regexp.test("anything else")
            ) {
                matched[api] = true;
                expect(expressLayer.handle).toBe(middleware);
                return;
            }
        }

        throw new Error("expected a middleware for " + api + " on brisketEngine");
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
