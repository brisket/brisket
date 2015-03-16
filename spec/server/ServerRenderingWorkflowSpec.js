"use strict";

describe("ServerRenderingWorkflow", function() {
    var Backbone = require("../../lib/application/Backbone");
    var $ = require("../../lib/application/jquery");
    var Promise = require("bluebird");
    var ServerRenderingWorkflow = require("../../lib/server/ServerRenderingWorkflow");
    var ServerRenderer = require("../../lib/server/ServerRenderer");
    var ServerRequest = require("../../lib/server/ServerRequest");
    var ServerResponse = require("../../lib/server/ServerResponse");
    var Layout = require("../../lib/viewing/Layout");
    var LayoutDelegate = require("../../lib/controlling/LayoutDelegate");
    var ErrorViewMapping = require("../../lib/errors/ErrorViewMapping");
    var Errors = require("../../lib/errors/Errors");

    var originalHandler;
    var expectedView;
    var environmentConfig;
    var fakeRouter;
    var handlerReturns;
    var PageNotFoundView;
    var ErrorView;
    var mockServerRequest;
    var mockServerResponse;

    beforeEach(function() {
        Backbone.$ = $;

        expectedView = new Backbone.View();
        environmentConfig = {
            "made": "in server rendering spec"
        };

        PageNotFoundView = Backbone.View.extend({
            name: "page_not_found"
        });

        ErrorView = Backbone.View.extend({
            name: "unhandled_error"
        });

        fakeRouter = {
            layout: Layout,
            errorViewMapping: errorViewMapping(),
            otherMethod: jasmine.createSpy(),
            close: jasmine.createSpy()
        };

        spyOn(Layout.prototype, "render").and.callThrough();
        spyOn(ServerRenderer, "render").and.returnValue("page was rendered");

        mockServerRequest = {
            id: "mockServerRequest"
        };

        mockServerResponse = new ServerResponse();
        mockServerResponse.id = "mockServerResponse";

        spyOn(ServerRequest, "from").and.returnValue(mockServerRequest);
        spyOn(ServerResponse, "create").and.returnValue(mockServerResponse);
    });

    it("ensures layout has been rendered before it is passed to route handlers", function(done) {
        originalHandler = function() {
            expect(Layout.prototype.render).toHaveBeenCalled();
            done();

            return expectedView;
        };

        handlerReturns = callAugmentedRouterHandler();
    });

    it("ensures layout has environmentConfig before it is passed to route handlers", function(done) {
        fakeRouter.layout = Layout.extend({

            testEnvironmentConfig: function() {
                expect(this.environmentConfig).toEqual({
                    "made": "in server rendering spec"
                });
            }

        });

        originalHandler = function(layout) {
            layout.testEnvironmentConfig();
            done();

            return expectedView;
        };

        handlerReturns = callAugmentedRouterHandler();
    });

    it("executes layout commands AFTER route handlers", function(done) {
        var codeWasExecuted = false;

        fakeRouter.layout = Layout.extend({

            testCodeWasExecuted: function() {
                codeWasExecuted = true;
            }

        });

        originalHandler = function(layout) {
            layout.testCodeWasExecuted();

            expect(codeWasExecuted).toBe(false);

            return expectedView;
        };

        callAugmentedRouterHandler().lastly(function() {
            expect(codeWasExecuted).toBe(true);
            done();
        });
    });

    describe("when route has finished", function() {
        var layoutCommandWasExecuted;
        var whenRouteFinished;

        beforeEach(function() {
            layoutCommandWasExecuted = false;

            fakeRouter.layout = Layout.extend({

                testLayoutCommandWasExecuted: function() {
                    layoutCommandWasExecuted = true;
                }

            });

            originalHandler = function(layout) {
                expectedView.on("event", function() {
                    layout.testLayoutCommandWasExecuted();
                });

                return expectedView;
            };

            whenRouteFinished = callAugmentedRouterHandler();
        });

        it("executes layout commands from route handler immediately", function(done) {
            whenRouteFinished.lastly(function() {
                expect(layoutCommandWasExecuted).toBe(false);

                expectedView.trigger("event");

                expect(layoutCommandWasExecuted).toBe(true);
                done();
            });
        });

    });

    describe("whenever handler is called", function() {

        beforeEach(function() {
            originalHandler = jasmine.createSpy().and.callFake(function() {
                return expectedView;
            });
        });

        it("calls original handler with params, layoutDelegate, brisketRequest, and brisketResponse", function(done) {
            handlerReturns = callAugmentedRouterHandlerWith("param1", "param2");

            handlerReturns.lastly(function() {
                expect(originalHandler)
                    .toHaveBeenCalledWith("param1", "param2", jasmine.any(LayoutDelegate), mockServerRequest, mockServerResponse);
                done();
            });
        });

    });

    describe("when original handler uses 'this'", function() {

        beforeEach(function() {
            originalHandler = function() {
                this.otherMethod();
            };
        });

        it("ensures original handler's scope is bound to router", function(done) {
            handlerReturns = callAugmentedRouterHandler();

            handlerReturns.lastly(function() {
                expect(fakeRouter.otherMethod).toHaveBeenCalled();
                done();
            });
        });

    });

    describe("when original handler redirects", function() {
        var restOfCodeInTheHandler;

        beforeEach(function() {
            restOfCodeInTheHandler = jasmine.createSpy("rest of code in the handler");

            originalHandler = function(layout, request, response) {
                response.redirect("go/somewhere");
                restOfCodeInTheHandler();
                return expectedView;
            };

            handlerReturns = callAugmentedRouterHandler();
        });

        it("does NOT execute the rest of code in the handler", function(done) {
            handlerReturns.lastly(function() {
                expect(restOfCodeInTheHandler).not.toHaveBeenCalled();
                done();
            });
        });

        it("does NOT render a View", function(done) {
            handlerReturns.lastly(function() {
                expect(ServerRenderer.render).not.toHaveBeenCalled();
                done();
            });
        });

        itCleansUpLayoutAndRouter();
    });

    describe("setting response headers", function() {

        it("sets serverResponse headers 'response.set' is called", function(done) {
            originalHandler = function(layout, request, response) {
                response.set("Cache-control", "public, max-age=3600");

                return expectedView;
            };

            handlerReturns = callAugmentedRouterHandler();

            handlerReturns.then(function(responseForRoute) {
                var headers = responseForRoute.serverResponse.headers;

                expect(headers).toEqual(jasmine.objectContaining({
                    "Cache-control": "public, max-age=3600"
                }));

                done();
            });
        });

    });

    describe("when original handler does NOT return a View NOR promise of View", function() {

        beforeEach(function() {
            originalHandler = function() {
                return null;
            };

            handlerReturns = callAugmentedRouterHandler();
        });

        it("does NOT render page without View", function(done) {
            handlerReturns.lastly(function() {
                expectNotToRender(jasmine.any(Layout), null);
                done();
            });
        });

        it("renders error view", function(done) {
            handlerReturns.lastly(function() {
                expectRenderFor(jasmine.any(Layout), jasmine.any(ErrorView));
                done();
            });
        });

        it("returns status of 500", function(done) {
            handlerReturns.caught(function(responseForRoute) {
                expect(responseForRoute.serverResponse.statusCode).toBe(500);
                done();
            });
        });

    });

    describe("when original handler returns View", function() {

        beforeEach(function() {
            originalHandler = function() {
                return expectedView;
            };

            handlerReturns = callAugmentedRouterHandler();
        });

        it("renders page", function(done) {
            handlerReturns.lastly(function() {
                expectRenderFor(jasmine.any(Layout), expectedView);
                done();
            });
        });

        it("returns promise of rendered page", function(done) {
            handlerReturns.then(function(responseForRoute) {
                expect(responseForRoute.html).toBe("page was rendered");
                done();
            });
        });

        itCleansUpLayoutAndRouter();
    });

    describe("when original handler returns promise of View", function() {

        beforeEach(function() {
            originalHandler = function() {
                return Promise.resolve(expectedView);
            };

            handlerReturns = callAugmentedRouterHandler();
        });

        it("render page", function(done) {
            handlerReturns.lastly(function() {
                expectRenderFor(jasmine.any(Layout), expectedView);
                done();
            });

        });

        it("returns promise of rendered page", function(done) {
            handlerReturns.then(function(responseForRoute) {
                expect(responseForRoute.html).toBe("page was rendered");
                done();
            });
        });

        itCleansUpLayoutAndRouter();
    });

    describe("when original handler returns rejected promise", function() {
        var error;

        beforeEach(function() {
            error = new Error("any error");

            originalHandler = function() {
                return Promise.reject(error);
            };

            spyOn(Errors, "notify");

            handlerReturns = callAugmentedRouterHandler();
        });

        it("logs the error", function(done) {
            handlerReturns.lastly(function() {
                expect(Errors.notify).toHaveBeenCalledWith(error);
                done();
            });
        });

        itCleansUpLayoutAndRouter();
    });

    describe("when original handler returns with a 404", function() {

        beforeEach(function() {
            originalHandler = function() {
                return Promise.reject({
                    status: 404
                });
            };

            handlerReturns = callAugmentedRouterHandler();
        });

        it("renders 404 view", function(done) {
            handlerReturns.lastly(function() {
                expectRenderFor(jasmine.any(Layout), jasmine.any(PageNotFoundView));
                done();
            });
        });

        it("returns status of 404", function(done) {
            handlerReturns.caught(function(responseForRoute) {
                expect(responseForRoute.serverResponse.statusCode).toBe(404);
                done();
            });
        });

        itCleansUpLayoutAndRouter();
    });

    describe("when original handler returns with a 500", function() {

        beforeEach(function() {
            originalHandler = function() {
                return Promise.reject({
                    status: 500
                });
            };

            handlerReturns = callAugmentedRouterHandler();
        });

        it("renders error view", function(done) {
            handlerReturns.lastly(function() {
                expectRenderFor(jasmine.any(Layout), jasmine.any(ErrorView));
                done();
            });
        });

        it("returns status of 500", function(done) {
            handlerReturns.caught(function(responseForRoute) {
                expect(responseForRoute.serverResponse.statusCode).toBe(500);
                done();
            });
        });

        itCleansUpLayoutAndRouter();
    });

    describe("when original handler returns error (not 500 or 404)", function() {

        beforeEach(function() {
            originalHandler = function() {
                return Promise.reject({
                    status: 503
                });
            };

            handlerReturns = callAugmentedRouterHandler();
        });

        it("renders error view", function(done) {
            handlerReturns.lastly(function() {
                expectRenderFor(jasmine.any(Layout), jasmine.any(ErrorView));
                done();
            });
        });

        it("returns status of 500", function(done) {
            handlerReturns.caught(function(responseForRoute) {
                expect(responseForRoute.serverResponse.statusCode).toBe(500);
                done();
            });
        });

        itCleansUpLayoutAndRouter();
    });

    describe("when original handler returns error and layout fetch data succeeds", function() {

        beforeEach(function() {
            var LayoutWithSuccessfulFetch = Layout.extend({
                fetchData: function() {
                    return Promise.resolve();
                }
            });

            fakeRouter = {
                layout: LayoutWithSuccessfulFetch,
                errorViewMapping: errorViewMapping(),
                close: jasmine.createSpy()
            };

            originalHandler = function() {
                return Promise.reject({
                    status: 404
                });
            };

            handlerReturns = callAugmentedRouterHandler();
        });

        it("returns status from view failure", function(done) {
            handlerReturns.caught(function(responseForRoute) {
                expect(responseForRoute.serverResponse.statusCode).toBe(404);
                done();
            });
        });

        itCleansUpLayoutAndRouter();
    });

    describe("when original handler returns error and layout fetch data returns error", function() {

        beforeEach(function() {
            var LayoutWithFailingFetch = Layout.extend({
                fetchData: function() {
                    return Promise.reject({
                        status: 404
                    });
                }
            });

            fakeRouter = {
                layout: LayoutWithFailingFetch,
                errorViewMapping: errorViewMapping(),
                close: jasmine.createSpy()
            };

            originalHandler = function() {
                return Promise.reject({
                    status: 500
                });
            };

            handlerReturns = callAugmentedRouterHandler();
        });

        it("returns status from layout failure", function(done) {
            handlerReturns.caught(function(responseForRoute) {
                expect(responseForRoute.serverResponse.statusCode).toBe(404);
                done();
            });
        });

        itCleansUpLayoutAndRouter();
    });

    describe("when original handler has an uncaught error", function() {

        beforeEach(function() {
            originalHandler = function() {
                throw new Error("something blew up");
            };

            handlerReturns = callAugmentedRouterHandler();
        });

        it("renders error view", function(done) {
            handlerReturns.lastly(function() {
                expectRenderFor(jasmine.any(Layout), jasmine.any(ErrorView));
                done();
            });
        });

        it("returns status of 500", function(done) {
            handlerReturns.caught(function(responseForRoute) {
                expect(responseForRoute.serverResponse.statusCode).toBe(500);
                done();
            });
        });

        itCleansUpLayoutAndRouter();
    });

    function itCleansUpLayoutAndRouter() {

        describe("cleaning up", function() {

            beforeEach(function() {
                spyOn(Layout.prototype, "close");
            });

            it("cleans up layout", function(done) {
                handlerReturns.lastly(function() {
                    expect(Layout.prototype.close).toHaveBeenCalled();
                    done();
                });
            });

            it("cleans up router", function(done) {
                handlerReturns.lastly(function() {
                    expect(fakeRouter.close).toHaveBeenCalled();
                    done();
                });
            });

        });

    }

    function expectRenderFor(layout, view) {
        expect(ServerRenderer.render).toHaveBeenCalledWith(
            layout,
            view,
            environmentConfig,
            "app/ClientApp",
            ServerRequest.from(mockExpressRequest(), environmentConfig)
        );
    }

    function expectNotToRender(layout, view) {
        expect(ServerRenderer.render).not.toHaveBeenCalledWith(
            layout,
            view,
            environmentConfig,
            "app/ClientApp",
            ServerRequest.from(mockExpressRequest(), environmentConfig)
        );
    }

    function callAugmentedRouterHandler() {
        return callAugmentedRouterHandlerWith();
    }

    function callAugmentedRouterHandlerWith() {
        var handler = ServerRenderingWorkflow.createHandlerFrom(originalHandler);
        var routeArguments = makeBackboneRouteArguments(arguments);
        return handler.call(fakeRouter, routeArguments, mockExpressRequest(), environmentConfig, "app/ClientApp");
    }

    function errorViewMapping() {
        return ErrorViewMapping.create({
            404: PageNotFoundView,
            500: ErrorView
        });
    }

    function mockExpressRequest() {
        return {
            protocol: "http",
            path: "/requested/path",
            host: "example.com",
            headers: {
                "host": "example.com",
                "user-agent": "A wonderful computer"
            }
        };
    }

    function makeBackboneRouteArguments(args) {
        return Array.prototype.slice.call(args, 0).concat(null);
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
