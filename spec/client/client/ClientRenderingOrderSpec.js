"use strict";

describe("Client side rendering order", function() {
    var ClientRenderingWorkflow = require("lib/client/ClientRenderingWorkflow");
    var View = require("lib/viewing/View");
    var MockRouter = require("mock/MockRouter");

    var renderingOrder;
    var expectedView;
    var originalHandler;
    var mockRouter;

    beforeEach(function() {
        expectedView = new View();
        renderingOrder = [];

        mockRouter = MockRouter.create();

        spyOn(mockRouter.layout.prototype, "reattach").and.callFake(function() {
            renderingOrder.push("layout reattaches");
        });

        spyOn(mockRouter.layout.prototype, "render").and.callFake(function() {
            renderingOrder.push("layout renders");

            this.hasBeenRendered = true;
        });

        spyOn(mockRouter.layout.prototype, "customMethod").and.callFake(function() {
            renderingOrder.push("layout instructions from route handler run");
        });

        originalHandler = function(layout) {
            renderingOrder.push("route handler runs");

            layout.customMethod();

            return expectedView;
        };

        spyOn(mockRouter.layout.prototype, "backToNormal").and.callFake(function() {
            renderingOrder.push("layout back to normal");
        });

        spyOn(mockRouter.layout.prototype, "onDOM").and.callFake(function() {
            renderingOrder.push("layout enters DOM");

            this.isInDOM = true;
        });

        spyOn(expectedView, "render").and.callFake(function() {
            renderingOrder.push("view for route renders");

            return this;
        });

        spyOn(expectedView, "onDOM").and.callFake(function() {
            renderingOrder.push("view for route enters DOM");
        });

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
                "layout back to normal",
                "layout instructions from route handler run",
                "layout enters DOM",
                "view for route renders",
                "view for route enters DOM"
            ]);

            done();
        });
    });

    it("maintains a predictable rendering lifecycle for layout AND view on all other requests", function(done) {
        runAnyOtherRequest().lastly(function() {
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

    function runFirstRequest() {
        var handler = ClientRenderingWorkflow.createHandlerFrom(originalHandler);

        return handler.apply(mockRouter);
    }

    function runAnyOtherRequest() {
        return runFirstRequest().then(function() {
            renderingOrder = [];

            return runFirstRequest();
        });
    }

});
