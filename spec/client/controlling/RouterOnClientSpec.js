"use strict";

describe("Routing on server", function() {
    var Router = require("lib/controlling/Router");
    var Backbone = require("backbone");
    var ClientRenderingWorkflow = require("lib/client/ClientRenderingWorkflow");

    var routeHandler;
    var ExampleRouter;
    var router;
    var handledRoute;

    beforeEach(function() {
        spyOn(ClientRenderingWorkflow, "execute");

        routeHandler = function() {};

        ExampleRouter = Router.extend({
            routes: {
                "route/:param": "routeHandler"
            },

            routeHandler: routeHandler
        });

        router = new ExampleRouter();

        Backbone.history.start();
    });

    afterEach(function() {
        Backbone.history.stop();
        Backbone.History.handlers = [];
    });

    describe("when route exists, Backbone.history", function() {

        beforeEach(function() {
            Backbone.history.loadUrl("route/1");
        });

        it("executes the matched handler with params", function() {
            // the extra null parameter is passed by Backbone v1.1.2+
            var expectedParams = ["1", null];

            expect(ClientRenderingWorkflow.execute).toHaveBeenCalledWith(
                router,
                routeHandler,
                expectedParams
            );
        });

    });

    describe("when route does NOT exist, Backbone.history", function() {

        beforeEach(function() {
            handledRoute = Backbone.history.loadUrl("notroute");
        });

        it("does NOT execute a handler", function() {
            expect(ClientRenderingWorkflow.execute).not.toHaveBeenCalled();
        });

    });

});
