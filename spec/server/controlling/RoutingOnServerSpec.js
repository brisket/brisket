"use strict";

describe("Routing on server", function() {
    var Router = require("../../../lib/controlling/Router");
    var ServerDispatcher = require("../../../lib/server/ServerDispatcher");
    var ServerRenderingWorkflow = require("../../../lib/server/ServerRenderingWorkflow");

    var mockRequest;
    var mockEnvironmentConfig;
    var mockClientAppRequirePath;
    var routeHandler;
    var ExampleRouter;
    var router;
    var handledRoute;

    beforeEach(function() {
        spyOn(ServerRenderingWorkflow, "execute").and.returnValue({
            html: "content"
        });

        mockRequest = {};
        mockEnvironmentConfig = {};
        mockClientAppRequirePath = "some/path";

        routeHandler = function() {};

        ExampleRouter = Router.extend({
            routes: {
                "route/:param": "routeHandler"
            },

            routeHandler: routeHandler
        });

        router = new ExampleRouter();
    });

    afterEach(function() {
        ServerDispatcher.reset();
    });

    describe("when route exists, ServerDispatcher", function() {

        beforeEach(function() {
            handledRoute = ServerDispatcher.dispatch(
                "route/1",
                mockRequest,
                mockEnvironmentConfig,
                mockClientAppRequirePath
            );
        });

        it("executes the matched handler with params", function() {
            // the extra null parameter is passed by Backbone v1.1.2+
            var expectedParams = ["1", null];

            expect(ServerRenderingWorkflow.execute).toHaveBeenCalledWith(
                router,
                routeHandler,
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

    describe("when route does NOT exist, ServerDispatcher", function() {

        beforeEach(function() {
            handledRoute = ServerDispatcher.dispatch(
                "notroute",
                mockRequest,
                mockEnvironmentConfig,
                mockClientAppRequirePath
            );
        });

        it("does NOT execute a handler", function() {
            expect(ServerRenderingWorkflow.execute).not.toHaveBeenCalled();
        });

        it("returns null", function() {
            expect(handledRoute).toBeNull();
        });

    });

});
