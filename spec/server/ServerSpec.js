"use strict";

describe("Server", function() {
    var Server = require("../../lib/server/Server");
    var ServerResponseWorkflow = require("../../lib/server/ServerResponseWorkflow");
    var ServerDispatcher = require("../../lib/server/ServerDispatcher");
    var Initializer = require("../../lib/application/Initializer");
    var ServerInitializer = require("../../lib/server/ServerInitializer");
    var App = require("../../lib/application/App");
    var _ = require("underscore");

    var API_HOST = "http://localhost:4000";

    beforeEach(function() {
        spyOn(Initializer, "forApp");
        spyOn(ServerInitializer, "forApp");
    });

    afterEach(function() {
        App.reset();
    });

    describe("#create", function() {

        it("initializes server and initializes App", function() {
            Server.create(validConfig());

            expect(Initializer.forApp).toHaveBeenCalled();
            expect(Initializer.forApp.calls.count()).toBe(1);

            expect(ServerInitializer.forApp).toHaveBeenCalled();
            expect(ServerInitializer.forApp.calls.count()).toBe(1);
        });

    });

    describe("apiHost", function() {

        it("throws if apiHost is NOT string", function() {
            function creatingServerWithoutApiHostString() {
                Server.create(validConfigWith({
                    apiHost: 123
                }));
            }

            expect(creatingServerWithoutApiHostString).toThrow();
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

            console.log(validConfigWith({
                environmentConfig: environmentConfig
            }));
            Server.create(validConfigWith({
                environmentConfig: environmentConfig
            }));

            expect(objectPassedToInitializeApp().environmentConfig)
                .toEqual(environmentConfig);

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
            expect(objectPassedToInitializeApp().serverConfig)
                .toHaveKeyValue("some", "data");

            expect(objectPassedToInitializeAppOnServer().serverConfig)
                .toHaveKeyValue("some", "data");
        });

        it("exposes apiHost to server initializers through serverConfig", function() {
            expect(objectPassedToInitializeApp().serverConfig)
                .toHaveKeyValue("apiHost", API_HOST);

            expect(objectPassedToInitializeAppOnServer().serverConfig)
                .toHaveKeyValue("apiHost", API_HOST);
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
            apiHost: API_HOST
        };
    }

    function validConfigWith(customSettings) {
        return _.extend(validConfig(), customSettings);
    }

    function objectPassedToInitializeApp() {
        return Initializer.forApp.calls.mostRecent().args[0];
    }

    function objectPassedToInitializeAppOnServer() {
        return ServerInitializer.forApp.calls.mostRecent().args[0];
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
