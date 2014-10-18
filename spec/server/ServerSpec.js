"use strict";

var Server = require("../../lib/server/Server");
var App = require("../../lib/application/App");
var ServerApp = require("../../lib/server/ServerApp");
var ServerResponseWorkflow = require("../../lib/server/ServerResponseWorkflow");
var _ = require("underscore");

describe("Server", function() {

    var API_HOST = "http://localhost:4000";

    beforeEach(function() {
        spyOn(ServerApp.prototype, "start");
    });

    it("throws if clientAppRequirePath is NOT string", function() {
        function creatingServerWithoutClientAppRequirePathString() {
            Server.create(validConfigWith({
                clientAppRequirePath: 123
            }));
        }

        expect(creatingServerWithoutClientAppRequirePathString).toThrow();
    });

    describe("#create", function() {

        it("starts 1 server app", function() {
            Server.create(validConfig());

            expect(ServerApp.prototype.start).toHaveBeenCalled();
            expect(ServerApp.prototype.start.calls.count()).toBe(1);
        });

        describe("validating configuration", function() {

            it("accepts a missing ServerApp", function() {
                function creatingServerWithoutServerApp() {
                    Server.create(validConfigWith({
                        ServerApp: undefined
                    }));
                }

                expect(creatingServerWithoutServerApp).not.toThrow();
            });

            it("rejects ServerApp that is some other type", function() {
                function creatingServerWithServerAppThatIsAnotherType() {
                    Server.create(validConfigWith({
                        ServerApp: "not a ServerApp"
                    }));
                }

                expect(creatingServerWithServerAppThatIsAnotherType).toThrow();
            });

            it("rejects a class that is not a sublcass of ServerApp", function() {
                function creatingServerWithClassThatIsNOTSubclassOfServerApp() {
                    Server.create(validConfigWith({
                        ServerApp: App
                    }));
                }

                expect(creatingServerWithClassThatIsNOTSubclassOfServerApp).toThrow();
            });

        });

        describe("when ServerApp is not passed in", function() {

            it("defaults to internal ServerApp", function() {
                Server.create(validConfig());

                expect(ServerApp.prototype.start).toHaveBeenCalled();
                expect(ServerApp.prototype.start.calls.count()).toBe(1);
            });

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

        it("is passed to ServerApp start method", function() {
            environmentConfig = {
                some: "data"
            };

            Server.create(validConfigWith({
                environmentConfig: environmentConfig
            }));

            expect(objectPassedToServerApp().environmentConfig).toEqual(environmentConfig);
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

        it("it's properties are passed to ServerApp start method", function() {
            expect(objectPassedToServerApp().serverConfig).toHaveKeyValue("some", "data");
        });

        it("exposes apiHost to ServerApp through serverConfig", function() {
            expect(objectPassedToServerApp().serverConfig).toHaveKeyValue("apiHost", API_HOST);
        });

    });

    describe("#sendResponseFromServerApp", function() {

        var middleware;
        var environmentConfig;
        var serverApp;
        var mockRequest;
        var mockResponse;
        var mockNext;
        var mockServerResponse;
        var mockCallback;

        beforeEach(function() {
            serverApp = {
                dispatch: jasmine.createSpy()
            };
            environmentConfig = {};
            middleware = Server.sendResponseFromServerApp(serverApp, environmentConfig);

            mockRequest = {
                path: "/aRoute",
                headers: {
                    host: "http://www.example.com:8080"
                }
            };

            mockResponse = {};
            mockNext = jasmine.createSpy();

            spyOn(ServerApp.prototype, "dispatch");
            spyOn(ServerResponseWorkflow, "sendResponseFor");
        });

        it("dispatches to server app with leading slash of request path stripped", function() {
            middleware(mockRequest, mockResponse, mockNext);
            expect(serverApp.dispatch.calls.mostRecent().args[0]).toBe("aRoute");
        });

        it("dispatches to server app with request host", function() {
            middleware(mockRequest, mockResponse, mockNext);
            expect(serverApp.dispatch.calls.mostRecent().args[1]).toBe(mockRequest);
        });

        it("dispatches to server app with client config", function() {
            middleware(mockRequest, mockResponse, mockNext);
            expect(serverApp.dispatch.calls.mostRecent().args[2]).toBe(environmentConfig);
        });

        describe("when server app CANNOT handle a request", function() {

            beforeEach(function() {
                serverApp.dispatch.and.returnValue(null);
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

        describe("when server app CAN handle a request", function() {

            beforeEach(function() {
                serverApp.dispatch.and.returnValue({
                    content: "html"
                });
            });

            it("does send server app response", function() {
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

                serverApp.dispatch.and.returnValue(mockServerResponse);
            });

            describe("when a server response callback handler is passed in", function() {

                beforeEach(function() {
                    mockCallback = jasmine.createSpy("mockCallback");

                    middleware = Server.sendResponseFromServerApp(
                        serverApp,
                        environmentConfig,
                        mockRequest.path,
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
                    middleware = Server.sendResponseFromServerApp(
                        serverApp,
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
            clientAppRequirePath: "app/ClientApp",
            apiHost: API_HOST,
            ServerApp: ServerApp
        };
    }

    function validConfigWith(customSettings) {
        return _.extend(validConfig(), customSettings);
    }

    function objectPassedToServerApp() {
        return ServerApp.prototype.start.calls.mostRecent().args[0];
    }

});

// ----------------------------------------------------------------------------
// Copyright (C) 2014 Bloomberg Finance L.P.
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
