"use strict";

describe("Server side rendering order", function() {
    var ServerRenderingWorkflow = require("../../lib/server/ServerRenderingWorkflow");
    var View = require("../../lib/viewing/View");
    var MockExpressRequest = require("../mock/MockExpressRequest");
    var MockRouter = require("../mock/MockRouter");

    var renderingOrder;
    var expectedView;
    var originalHandler;
    var mockRouter;

    beforeEach(function() {
        expectedView = newExpectedView();
        renderingOrder = [];

        mockRouter = MockRouter.create();

        spyRenderingFor(mockRouter);

        originalHandler = function(layout) {
            renderingOrder.push("route handler runs");

            layout.customMethod();

            return expectedView;
        };

    });

    it("maintains a predictable rendering lifecycle for layout AND view on first request", function(done) {
        runRequest().lastly(function() {
            expect(renderingOrder).toEqual([
                "layout fetches data",
                "route handler runs",
                "layout renders",
                "layout instructions from route handler run",
                "view for route renders"
            ]);

            done();
        });
    });

    function runRequest() {
        var handler = ServerRenderingWorkflow.createHandlerFrom(originalHandler);

        return handler.call(
            mockRouter, [null],
            MockExpressRequest.basic(), {},
            "app/ClientApp"
        );
    }

    function spyRenderingFor(router) {
        spyOn(router.layout.prototype, "fetchData").and.callFake(function() {
            renderingOrder.push("layout fetches data");
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
