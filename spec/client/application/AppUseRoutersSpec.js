"use strict";

describe("Routers", function() {
    var App = require("lib/application/App");
    var Backbone = require("lib/application/Backbone");

    var CatchAllRouter;
    var Router1;
    var Router2;
    var orderRoutersInitialized;

    beforeEach(function() {
        orderRoutersInitialized = [];

        CatchAllRouter = Backbone.Router.extend({
            initialize: function() {
                orderRoutersInitialized.push("catch_all");
            }
        });
        Router1 = Backbone.Router.extend({
            initialize: function() {
                orderRoutersInitialized.push("router1");
            }
        });
        Router2 = Backbone.Router.extend({
            initialize: function() {
                orderRoutersInitialized.push("router2");
            }
        });
    });

    afterEach(function() {
        App.reset();
    });

    describe("#init", function() {

        describe("when catch all router is set", function() {

            beforeEach(function() {
                App.useRouters({
                    CatchAllRouter: CatchAllRouter,

                    routers: [
                        Router1,
                        Router2
                    ]
                });

                App.initialize();
            });

            it("initializes catch all router first", function() {
                expect(orderRoutersInitialized[0]).toBe("catch_all");
            });

        });

        describe("when no catch all router is set", function() {

            beforeEach(function() {
                App.useRouters({
                    routers: [
                        Router1,
                        Router2,
                        CatchAllRouter
                    ]
                });
            });

            it("does NOT throw an error", function() {
                var initializingRoutersWithoutCatchAll = function() {
                    App.initialize();
                };

                expect(initializingRoutersWithoutCatchAll).not.toThrow();
            });

        });

    });

});

// ----------------------------------------------------------------------------
// Copyright (C) 2016 Bloomberg Finance L.P.
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
