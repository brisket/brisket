"use strict";

describe("Client side rendering order", function() {
    var ClientRenderingWorkflow = require("lib/client/ClientRenderingWorkflow");
    var View = require("lib/viewing/View");
    var MockRouter = require("mock/MockRouter");
    var Layout = require("lib/viewing/Layout");
    var noop = require("lib/util/noop");

    var renderingOrder;
    var expectedView;
    var originalHandler;
    var mockRouter;
    var mockRouterWithDifferentLayout;

    beforeEach(function() {
        ClientRenderingWorkflow.reset();

        expectedView = newExpectedView();
        renderingOrder = [];

        mockRouter = MockRouter.create();
        mockRouterWithDifferentLayout = MockRouter.create({
            layout: Layout.extend({
                customMethod: noop
            })
        });

        [mockRouter, mockRouterWithDifferentLayout].forEach(spyRenderingFor);

        originalHandler = function(layout) {
            renderingOrder.push("route handler runs");

            layout.customMethod();

            return expectedView;
        };

    });

    afterEach(function() {
        ClientRenderingWorkflow.reset();
    });

    it("maintains a predictable rendering lifecycle for layout AND view on first request", function(done) {
        runFirstRequest().lastly(function() {
            expect(renderingOrder).toEqual([
                "layout reattaches",
                "layout renders",
                "route handler runs",
                "layout instructions from route handler run",
                "view for route renders",
                "layout enters DOM",
                "view for route enters DOM"
            ]);

            done();
        });
    });

    it("maintains a predictable rendering lifecycle for layout " +
        "AND view on all other requests when layout does NOT change",
        function(done) {
            runAnotherRequestWhereLayoutDoesntChange().lastly(function() {
                expect(renderingOrder).toEqual([
                    "route handler runs",
                    "layout back to normal",
                    "layout instructions from route handler run",
                    "view for route renders",
                    "view for route enters DOM"
                ]);

                done();
            });
        });

    it("maintains a predictable rendering lifecycle for layout " +
        "AND view on all other requests when layout changes",
        function(done) {
            runAnotherRequestWhereLayoutChanges().lastly(function() {
                expect(renderingOrder).toEqual([
                    "layout reattaches",
                    "layout renders",
                    "route handler runs",
                    "layout back to normal",
                    "layout instructions from route handler run",
                    "view for route renders",
                    "layout enters DOM",
                    "view for route enters DOM"
                ]);

                done();
            });
        });

    function runRequest(router) {
        var handler = ClientRenderingWorkflow.createHandlerFrom(originalHandler);

        return handler.call(router);
    }

    function runFirstRequest() {
        return runRequest(mockRouter);
    }

    function runAnotherRequestWhereLayoutDoesntChange() {
        return runRequest(mockRouter).then(function() {
            renderingOrder = [];
            expectedView = newExpectedView();

            return runRequest(mockRouter);
        });
    }

    function runAnotherRequestWhereLayoutChanges() {
        return runRequest(mockRouter).then(function() {
            renderingOrder = [];
            expectedView = newExpectedView();

            return runRequest(mockRouterWithDifferentLayout);
        });
    }

    function spyRenderingFor(router) {

        spyOn(router.layout.prototype, "reattach").and.callFake(function() {
            renderingOrder.push("layout reattaches");
        });

        spyOn(router.layout.prototype, "render").and.callFake(function() {
            renderingOrder.push("layout renders");

            this.hasBeenRendered = true;
        });

        spyOn(router.layout.prototype, "customMethod").and.callFake(function() {
            renderingOrder.push("layout instructions from route handler run");
        });

        spyOn(router.layout.prototype, "backToNormal").and.callFake(function() {
            renderingOrder.push("layout back to normal");
        });

        spyOn(router.layout.prototype, "onDOM").and.callFake(function() {
            renderingOrder.push("layout enters DOM");

            this.isInDOM = true;
        });
    }

    function newExpectedView() {
        var view = new View();

        spyOn(view, "render").and.callFake(function() {
            renderingOrder.push("view for route renders");

            return this;
        });

        spyOn(view, "onDOM").and.callFake(function() {
            renderingOrder.push("view for route enters DOM");
        });

        return view;
    }

});
