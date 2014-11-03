"use strict";

describe("ServerRenderingWorkflow", function() {
    var Backbone = require("../../lib/application/Backbone");
    var $ = require("../../lib/application/jquery");
    var Promise = require("bluebird");
    var ServerRenderingWorkflow = require("../../lib/server/ServerRenderingWorkflow");
    var ServerRenderer = require("../../lib/server/ServerRenderer");
    var ServerRequest = require("../../lib/server/ServerRequest");
    var Layout = require("../../lib/viewing/Layout");
    var ErrorViewMapping = require("../../lib/errors/ErrorViewMapping");
    var Errors = require("../../lib/errors/Errors");

    var originalHandler;
    var expectedView;
    var host;
    var environmentConfig;
    var fakeRouter;
    var onRender;
    var handlerReturns;
    var PageNotFoundView;
    var ErrorView;
    var mockBrisketRequest;

    beforeEach(function() {
        Backbone.$ = $;

        host = "http://www.anything.com";
        onRender = function() {};
        expectedView = new Backbone.View();
        environmentConfig = {};

        PageNotFoundView = Backbone.View.extend({
            name: "page_not_found"
        });

        ErrorView = Backbone.View.extend({
            name: "unhandled_error"
        });

        fakeRouter = {
            layout: Layout,
            errorViewMapping: errorViewMapping(),
            onRender: onRender,
            otherMethod: jasmine.createSpy(),
            close: jasmine.createSpy()
        };

        spyOn(ServerRenderer, "render").and.returnValue("page was rendered");

        mockBrisketRequest = {};

        spyOn(ServerRequest, "from").and.returnValue(mockBrisketRequest);
    });

    describe("whenever handler is called", function() {

        beforeEach(function() {
            originalHandler = jasmine.createSpy();
        });

        it("calls original handler with params", function(done) {
            handlerReturns = callAugmentedRouterHandlerWith("param1", "param2");

            handlerReturns.lastly(function() {
                expect(originalHandler).toHaveBeenCalledWith("param1", "param2", mockBrisketRequest);
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
            handlerReturns.caught(function(errorResponse) {
                expect(errorResponse.status).toBe(500);
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
            handlerReturns.then(function(html) {
                expect(html).toBe("page was rendered");
                done();
            });
        });

        itCleansUpWhen();
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
            handlerReturns.then(function(html) {
                expect(html).toBe("page was rendered");
                done();
            });
        });

        itCleansUpWhen();
    });

    describe("when original handler returns rejected promise", function() {
        var error;

        beforeEach(function() {
            error = new Error("any error");

            originalHandler = function() {
                return Promise.reject(error);
            };

            spyOn(Errors, "log");

            handlerReturns = callAugmentedRouterHandler();
        });

        it("logs the error", function(done) {
            handlerReturns.lastly(function() {
                expect(Errors.log).toHaveBeenCalledWith(error);
                done();
            });
        });

        itCleansUpWhen();
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
            handlerReturns.caught(function(errorResponse) {
                expect(errorResponse.status).toBe(404);
                done();
            });
        });

        itCleansUpWhen();
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
            handlerReturns.caught(function(errorResponse) {
                expect(errorResponse.status).toBe(500);
                done();
            });
        });

        itCleansUpWhen();
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
            handlerReturns.caught(function(errorResponse) {
                expect(errorResponse.status).toBe(500);
                done();
            });
        });

        itCleansUpWhen();
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
                onRender: onRender,
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
            handlerReturns.caught(function(errorResponse) {
                expect(errorResponse.status).toBe(404);
                done();
            });
        });

        itCleansUpWhen();
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
                onRender: onRender,
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
            handlerReturns.caught(function(errorResponse) {
                expect(errorResponse.status).toBe(404);
                done();
            });
        });

        itCleansUpWhen();
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
            handlerReturns.caught(function(errorResponse) {
                expect(errorResponse.status).toBe(500);
                done();
            });
        });

        itCleansUpWhen();
    });

    function itCleansUpWhen() {

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
            onRender,
            host,
            environmentConfig,
            "app/ClientApp",
            ServerRequest.from(mockExpressRequest())
        );
    }

    function expectNotToRender(layout, view) {
        expect(ServerRenderer.render).not.toHaveBeenCalledWith(
            layout,
            view,
            onRender,
            host,
            environmentConfig,
            "app/ClientApp",
            ServerRequest.from(mockExpressRequest())
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
                "host": host,
                "user-agent": "A wonderful computer"
            }
        };
    }

    function makeBackboneRouteArguments(args) {
        return Array.prototype.slice.call(args, 0).concat(null);
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
