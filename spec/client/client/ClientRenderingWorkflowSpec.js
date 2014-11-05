"use strict";

describe("ClientRenderingWorkflow", function() {
    var ClientRenderingWorkflow = require("lib/client/ClientRenderingWorkflow");
    var ClientRenderer = require("lib/client/ClientRenderer");
    var ClientRequest = require("lib/client/ClientRequest");
    var Layout = require("lib/viewing/Layout");
    var Backbone = require("lib/application/Backbone");
    var ErrorViewMapping = require("lib/errors/ErrorViewMapping");
    var Errors = require("lib/errors/Errors");
    var Promise = require("bluebird");

    var originalHandler;
    var expectedView;
    var expectedView2;
    var fakeRouter;
    var onRender;
    var handlerReturns;
    var ExampleLayout;
    var PageNotFoundView;
    var ErrorView;
    var onRouteStart;
    var onRouteComplete;
    var secondHandler;
    var firstReturns;
    var secondReturns;
    var bothReturn;
    var mockBrisketRequest;

    beforeEach(function() {
        ExampleLayout = Layout.extend({
            name: "example"
        });

        onRender = function() {};
        expectedView = new Backbone.View();

        PageNotFoundView = Backbone.View.extend({
            name: "page_not_found"
        });
        ErrorView = Backbone.View.extend({
            name: "unhandled_error"
        });

        onRouteStart = jasmine.createSpy();
        onRouteComplete = jasmine.createSpy();

        fakeRouter = {
            layout: ExampleLayout,
            errorViewMapping: ErrorViewMapping.create({
                404: PageNotFoundView,
                500: ErrorView
            }),
            onRender: onRender,
            otherMethod: jasmine.createSpy(),
            onRouteStart: onRouteStart,
            onRouteComplete: onRouteComplete,
            close: jasmine.createSpy()
        };

        spyOn(Errors, "log");

        spyOn(ClientRenderer, "render").and.returnValue("page was rendered");

        mockBrisketRequest = {};

        spyOn(ClientRequest, "from").and.returnValue(mockBrisketRequest);
        spyOn(Layout.prototype, "close");
    });

    afterEach(function() {
        ClientRenderingWorkflow.reset();
    });

    describe("whenever handler is called", function() {

        beforeEach(function() {
            originalHandler = jasmine.createSpy();
        });

        it("calls original handler with params and brisketRequest", function(done) {
            callAugmentedRouterHandlerWith(originalHandler, "param1", "param2")
                .then(function() {
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
            callAugmentedRouterHandler()
                .then(function() {
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

        it("does NOT render without View", function(done) {
            handlerReturns.lastly(function() {
                expectNotToRender(null);
                done();
            });
        });

        it("renders error view", function(done) {
            handlerReturns
                .then(function() {
                    expectRenderFor(jasmine.any(ErrorView));
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
            handlerReturns
                .then(function() {
                    expectRenderFor(expectedView);
                    done();
                });
        });

        it("returns promise of rendered page", function(done) {
            handlerReturns
                .then(function(html) {
                    expect(html).toBe("page was rendered");
                    done();
                });
        });

        itCleansUpRouter();
    });

    describe("when original handler returns promise of View", function() {

        beforeEach(function() {
            originalHandler = function() {
                return Promise.resolve(expectedView);
            };

            handlerReturns = callAugmentedRouterHandler();
        });

        it("render page", function(done) {
            handlerReturns
                .then(function() {
                    expectRenderFor(expectedView);
                    done();
                });

        });

        it("returns promise of rendered page", function(done) {
            handlerReturns
                .then(function(html) {
                    expect(html).toBe("page was rendered");
                    done();
                });
        });

        itCleansUpRouter();
    });

    describe("when original handler returns a rejected promise", function() {

        beforeEach(function() {
            originalHandler = function() {
                return Promise.reject("any error");
            };

            handlerReturns = callAugmentedRouterHandler();
        });

        it("logs the error to console", function(done) {
            handlerReturns
                .then(function() {
                    expect(Errors.log).toHaveBeenCalledWith("any error");
                    done();
                });
        });

        itCleansUpRouter();
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
            handlerReturns
                .then(function() {
                    expectRenderFor(jasmine.any(PageNotFoundView));
                    done();
                });
        });

        it("logs the jqxhr to console", function(done) {
            handlerReturns
                .then(function() {
                    expect(Errors.log.calls.mostRecent().args[0]).toEqual({
                        status: 404
                    });
                    done();
                });
        });

        itCleansUpRouter();
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
            handlerReturns
                .then(function() {
                    expectRenderFor(jasmine.any(ErrorView));
                    done();
                });
        });

        it("logs the jqxhr to console", function(done) {
            handlerReturns
                .then(function() {
                    expect(Errors.log.calls.mostRecent().args[0]).toEqual({
                        status: 500
                    });
                    done();
                });
        });

        itCleansUpRouter();
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
            handlerReturns
                .then(function() {
                    expectRenderFor(jasmine.any(ErrorView));
                    done();
                });
        });

        it("logs the jqxhr to console", function(done) {
            handlerReturns
                .then(function() {
                    expect(Errors.log.calls.mostRecent().args[0]).toEqual({
                        status: 503
                    });
                    done();
                });
        });

        itCleansUpRouter();
    });

    describe("when original handler has an uncaught error", function() {
        var error;

        beforeEach(function() {
            error = new Error("something blew up");

            originalHandler = function() {
                throw error;
            };

            handlerReturns = callAugmentedRouterHandler();
        });

        it("renders error view", function(done) {
            handlerReturns
                .then(function() {
                    expectRenderFor(jasmine.any(ErrorView));
                    done();
                });
        });

        it("logs the jqxhr to console", function(done) {
            handlerReturns
                .then(function() {
                    expect(Errors.log).toHaveBeenCalledWith(error);
                    done();
                });
        });

        itCleansUpRouter();
    });

    describe("the first client side render", function() {

        beforeEach(function() {
            originalHandler = function() {
                return expectedView;
            };

            spyOn(Layout.prototype, "fetchData");
            handlerReturns = callAugmentedRouterHandler();
        });

        it("fetches layout data", function(done) {
            handlerReturns
                .then(function() {
                    expect(Layout.prototype.fetchData).toHaveBeenCalled();
                    done();
                });
        });

        it("requests that ClientRenderer initialize layout", function(done) {
            handlerReturns
                .then(function() {
                    expect(ClientRenderer.render).toHaveBeenCalledWith(
                        jasmine.any(Layout),
                        true,
                        expectedView,
                        onRender,
                        1
                    );

                    done();
                });
        });

        itCleansUpRouter();
    });

    describe("all client side renders except for the first", function() {

        var firstHandlerReturns;
        var CurrentLayout;
        var NewLayout;

        beforeEach(function() {
            originalHandler = jasmine.createSpy();
            CurrentLayout = Layout.extend({
                name: "currentLayout"
            });
            spyOn(CurrentLayout.prototype, "fetchData");

            fakeRouter.layout = CurrentLayout;
            firstHandlerReturns = callAugmentedRouterHandler();
        });

        describe("when new layout is different from the current layout that has been rendered", function() {

            beforeEach(function() {
                NewLayout = Layout.extend({
                    name: "anotherLayout"
                });
                spyOn(NewLayout.prototype, "fetchData");

                fakeRouter.layout = NewLayout;
                expectedView2 = new Backbone.View();
                handlerReturns = callAugmentedRouterHandler(function() {
                    return expectedView2;
                });

                bothReturn = Promise.all([firstHandlerReturns, handlerReturns]);
            });

            it("fetches layout data for new layout", function(done) {
                bothReturn
                    .then(function() {
                        expect(NewLayout.prototype.fetchData.calls.count()).toBe(1);
                        done();
                    });
            });

            it("requests that ClientRenderer initializes new layout", function(done) {
                bothReturn
                    .then(function() {
                        expect(ClientRenderer.render).toHaveBeenCalledWith(
                            jasmine.any(NewLayout),
                            true,
                            expectedView2,
                            onRender,
                            2
                        );

                        done();
                    });
            });

            itCleansUpLayout();

            itCleansUpBothRouters();
        });

        describe("when second request wants to render with current layout that was used in first request", function() {

            beforeEach(function() {
                expectedView2 = new Backbone.View();
                handlerReturns = callAugmentedRouterHandler(function() {
                    return expectedView2;
                });

                expectCurrentLayoutToBeFetchedAfterFirstRequest();

                bothReturn = Promise.all([firstHandlerReturns, handlerReturns]);
            });

            it("does NOT fetch layout data for second request", function(done) {
                expectCurrentLayoutToNotBeFetchedAgainOnSecondRequest(done);
            });

            it("does NOT request that ClientRenderer initializes layout for second request", function(done) {
                handlerReturns
                    .then(function() {
                        expect(ClientRenderer.render).toHaveBeenCalledWith(
                            jasmine.any(CurrentLayout),
                            false,
                            expectedView2,
                            onRender,
                            2
                        );

                        done();
                    });
            });

            var expectCurrentLayoutToBeFetchedAfterFirstRequest = function() {
                firstHandlerReturns
                    .then(function() {
                        expect(CurrentLayout.prototype.fetchData.calls.count()).toBe(1);
                    });
            };

            var expectCurrentLayoutToNotBeFetchedAgainOnSecondRequest = function(done) {
                bothReturn
                    .then(function() {
                        expect(CurrentLayout.prototype.fetchData.calls.count()).toBe(1);
                        done();
                    });
            };

            itDoesNotCleanUpLayout();

            itCleansUpBothRouters();
        });

    });

    describe("when original handler returns cancelled request", function() {

        describe("when readyState is 0", function() {

            beforeEach(function() {
                originalHandler = function() {
                    return Promise.reject({
                        readyState: 0
                    });
                };
            });

            it("should NOT render", function(done) {
                callAugmentedRouterHandler()
                    .then(function() {
                        expect(ClientRenderer.render).not.toHaveBeenCalled();
                        done();
                    });
            });

            it("does NOT clean up layout", function(done) {
                callAugmentedRouterHandler()
                    .then(function() {
                        expect(Layout.prototype.close).not.toHaveBeenCalled();
                        done();
                    });
            });

            it("cleans up router", function(done) {
                callAugmentedRouterHandler()
                    .then(function() {
                        expect(fakeRouter.close).toHaveBeenCalled();
                        done();
                    });
            });

        });

        describe("when statusCode is 0", function() {

            beforeEach(function() {
                originalHandler = function() {
                    return Promise.reject({
                        status: 0
                    });
                };
            });

            it("should NOT render when", function(done) {
                callAugmentedRouterHandler()
                    .then(function() {
                        expect(ClientRenderer.render).not.toHaveBeenCalled();
                        done();
                    });
            });

            it("does NOT clean up layout", function(done) {
                callAugmentedRouterHandler()
                    .then(function() {
                        expect(Layout.prototype.close).not.toHaveBeenCalled();
                        done();
                    });
            });

            it("cleans up router", function(done) {
                callAugmentedRouterHandler()
                    .then(function() {
                        expect(fakeRouter.close).toHaveBeenCalled();
                        done();
                    });
            });

        });

    });

    describe("when the first render request takes longer to return than the second", function() {

        beforeEach(function() {
            expectedView2 = new Backbone.View();
            expectedView2.id = "view2";
        });

        describe("when both handlers are resolved", function() {

            beforeEach(function() {
                originalHandler = function() {
                    return Promise.delay(10).then(function() {
                        return expectedView;
                    });
                };

                secondHandler = function() {
                    return Promise.delay(5).then(function() {
                        return expectedView2;
                    });
                };

                runBothHandlers();
            });

            it("does NOT render the first request", function(done) {
                bothReturn
                    .then(function() {
                        expect(ClientRenderer.render).not.toHaveBeenCalledWith(
                            jasmine.any(Layout),
                            false,
                            expectedView,
                            onRender,
                            jasmine.any(Number)
                        );

                        done();
                    });
            });

            it("renders the latest request", function(done) {
                bothReturn
                    .then(function() {
                        expect(ClientRenderer.render).toHaveBeenCalledWith(
                            jasmine.any(Layout),
                            false,
                            expectedView2,
                            onRender,
                            2
                        );

                        done();
                    });
            });

            itDoesNotCleanUpLayout();

            itCleansUpBothRouters();
        });

        describe("when first handler results in error view", function() {

            beforeEach(function() {
                originalHandler = function() {
                    return Promise.delay(10).then(function() {
                        throw {
                            status: 404
                        };
                    });
                };

                secondHandler = function() {
                    return Promise.delay(5).then(function() {
                        return expectedView2;
                    });
                };

                runBothHandlers();
            });

            it("does NOT render the first request", function(done) {
                bothReturn
                    .then(function() {
                        expect(ClientRenderer.render).not.toHaveBeenCalledWith(
                            jasmine.any(Layout),
                            false,
                            jasmine.any(PageNotFoundView),
                            onRender,
                            jasmine.any(Number)
                        );

                        done();
                    });
            });

            it("renders the latest request", function(done) {
                bothReturn
                    .then(function() {
                        expect(ClientRenderer.render).toHaveBeenCalledWith(
                            jasmine.any(Layout),
                            false,
                            expectedView2,
                            onRender,
                            2
                        );

                        done();
                    });
            });

            itDoesNotCleanUpLayout();

            itCleansUpBothRouters();
        });

        describe("when second handler results in error view", function() {

            beforeEach(function() {
                originalHandler = function() {
                    return Promise.delay(10).then(function() {
                        return expectedView;
                    });
                };

                secondHandler = function() {
                    return Promise.delay(5).then(function() {
                        throw {
                            status: 404
                        };
                    });
                };

                runBothHandlers();
            });

            it("does NOT render the first request", function(done) {
                bothReturn
                    .then(function() {
                        expect(ClientRenderer.render).not.toHaveBeenCalledWith(
                            jasmine.any(Layout),
                            false,
                            expectedView,
                            onRender,
                            jasmine.any(Number)
                        );

                        done();
                    });
            });

            it("renders the latest request", function(done) {
                bothReturn
                    .then(function() {
                        expect(ClientRenderer.render).toHaveBeenCalledWith(
                            jasmine.any(Layout),
                            false,
                            jasmine.any(PageNotFoundView),
                            onRender,
                            2
                        );

                        done();
                    });
            });

            itDoesNotCleanUpLayout();

            itCleansUpBothRouters();
        });

        describe("when both handlers result in error view", function() {

            beforeEach(function() {
                originalHandler = function() {
                    return Promise.delay(10).then(function() {
                        throw {
                            status: 500
                        };
                    });
                };

                secondHandler = function() {
                    return Promise.delay(5).then(function() {
                        throw {
                            status: 404
                        };
                    });
                };

                runBothHandlers();
            });

            it("does NOT render the first request", function(done) {
                bothReturn
                    .then(function() {
                        expect(ClientRenderer.render).not.toHaveBeenCalledWith(
                            jasmine.any(Layout),
                            false,
                            jasmine.any(ErrorView),
                            onRender,
                            jasmine.any(Number)
                        );

                        done();
                    });
            });

            it("renders the latest request", function(done) {
                bothReturn
                    .then(function() {
                        expect(ClientRenderer.render).toHaveBeenCalledWith(
                            jasmine.any(Layout),
                            false,
                            jasmine.any(PageNotFoundView),
                            onRender,
                            2
                        );

                        done();
                    });

            });

            itDoesNotCleanUpLayout();

            itCleansUpBothRouters();
        });

    });

    describe("route start and end hooks", function() {

        beforeEach(function() {
            originalHandler = function() {
                return Promise.delay(5).then(function() {
                    return expectedView;
                });
            };
        });

        describe("when route starts", function() {

            it("fires the on route start callback", function() {
                handlerReturns = callAugmentedRouterHandler();

                expect(onRouteStart).toHaveBeenCalledWith(jasmine.any(Layout), mockBrisketRequest);
            });

        });

        describe("when route ends", function() {

            it("fires the on route end handler from the router", function(done) {
                handlerReturns = callAugmentedRouterHandler();

                expect(onRouteComplete).not.toHaveBeenCalled();

                handlerReturns
                    .then(function() {
                        expect(onRouteComplete).toHaveBeenCalledWith(jasmine.any(Layout), mockBrisketRequest);
                        done();
                    });
            });

        });

        describe("when the first request takes longer than the second", function() {

            beforeEach(function() {
                secondHandler = function() {
                    return Promise.delay(2).then(function() {
                        return expectedView;
                    });
                };

                runBothHandlers();
            });

            it("only fires onRouteComplete for second request", function(done) {
                secondReturns
                    .then(function() {
                        expect(onRouteComplete).toHaveBeenCalledWith(jasmine.any(Layout), mockBrisketRequest);
                        expect(onRouteComplete.calls.count()).toBe(1);
                    });

                bothReturn
                    .then(function() {
                        expect(onRouteComplete.calls.count()).toBe(1);
                        done();
                    });
            });

        });

    });

    function itCleansUpRouter() {
        it("cleans up router", function(done) {
            handlerReturns
                .then(function() {
                    expect(fakeRouter.close).toHaveBeenCalled();
                    done();
                });
        });
    }

    function itCleansUpBothRouters() {
        it("cleans up router for both requests", function(done) {
            bothReturn
                .then(function() {
                    expect(fakeRouter.close.calls.count()).toBe(2);
                    done();
                });
        });
    }

    function itDoesNotCleanUpLayout() {
        it("does NOT clean up layout", function(done) {
            handlerReturns
                .then(function() {
                    expect(Layout.prototype.close).not.toHaveBeenCalled();
                    done();
                });
        });
    }

    function itCleansUpLayout() {

        it("cleans up layout", function(done) {
            handlerReturns
                .then(function() {
                    expect(Layout.prototype.close).toHaveBeenCalled();
                    done();
                });
        });

    }

    function runBothHandlers() {
        firstReturns = callAugmentedRouterHandler(originalHandler);
        secondReturns = callAugmentedRouterHandler(secondHandler);

        bothReturn = Promise.all([firstReturns, secondReturns]);
    }

    function expectRenderFor(view) {
        expect(ClientRenderer.render).toHaveBeenCalledWith(
            jasmine.any(Layout),
            true,
            view,
            onRender,
            1
        );
    }

    function expectNotToRender(view) {
        expect(ClientRenderer.render).not.toHaveBeenCalledWith(
            jasmine.any(Layout),
            true,
            view,
            onRender,
            1
        );
    }

    function callAugmentedRouterHandler(handler) {
        handler = handler || originalHandler;
        return callAugmentedRouterHandlerWith(handler);
    }

    function callAugmentedRouterHandlerWith(handler) {
        var args = Array.prototype.slice.call(arguments, 1);
        var augmentedHandler = ClientRenderingWorkflow.createHandlerFrom(handler);

        return augmentedHandler.apply(fakeRouter, args.concat(null));
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
