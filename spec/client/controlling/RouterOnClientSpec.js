"use strict";

describe("Routing on server", function() {
    var Router = require("lib/controlling/Router");
    var Backbone = require("backbone");
    var ClientRenderingWorkflow = require("lib/client/ClientRenderingWorkflow");

    var routeHandler;
    var ExampleRouter;
    var router;

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
            Backbone.history.loadUrl("notroute");
        });

        it("does NOT execute a handler", function() {
            expect(ClientRenderingWorkflow.execute).not.toHaveBeenCalled();
        });

    });

});

// ----------------------------------------------------------------------------
// Copyright (C) 2017 Bloomberg Finance L.P.
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
