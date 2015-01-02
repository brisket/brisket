"use strict";

var RouterBrewery = require("lib/controlling/RouterBrewery");
var Environment = require("lib/environment/Environment");
var Backbone = require("lib/application/Backbone");

describe("RouterBrewery on client", function() {

    var ExampleRouter;
    var router;

    beforeEach(function() {
        spyOn(Environment, "isServer").and.returnValue(false);
    });

    describe("#create", function() {

        it("creates routers that CANNOT be extended the traditional way", function() {
            createRouter();

            var attemptingToExtendRouterBreweryCreatedRouter = function() {
                ExampleRouter.extend();
            };

            expect(attemptingToExtendRouterBreweryCreatedRouter).toThrow();
        });

        it("creates standard backbone routers", function() {
            createRouter();

            expect(router instanceof Backbone.Router).toBe(true);
        });

    });

    describe("#makeBreweryWithDefaults", function() {

        var Brewery;
        var defaults;
        var BreweryCreatedRouter;

        beforeEach(function() {
            defaults = {
                layout: "some layout",
                errorViewMapping: "some error view mapping"
            };

            Brewery = RouterBrewery.makeBreweryWithDefaults(defaults);
            BreweryCreatedRouter = null;
        });

        it("makes a brewery that makes routers with defaults", function() {
            BreweryCreatedRouter = Brewery.create();
            router = new BreweryCreatedRouter();

            expect(router.layout).toBe("some layout");
            expect(router.errorViewMapping).toBe("some error view mapping");
        });

    });

    describe("when Router has a route without a handler", function() {

        it("throws an error", function() {
            var creatingRouterWithRouteAndMissingHandler = function() {
                RouterBrewery.create({
                    routes: {
                        "routeTo": "missingHandler"
                    }
                });
            };

            expect(creatingRouterWithRouteAndMissingHandler).toThrow();
        });

    });

    function createRouter() {
        ExampleRouter = RouterBrewery.create();
        router = new ExampleRouter();
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
