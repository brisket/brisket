"use strict";

describe("RouterBrewery on client", function() {
    var RouterBrewery = require("../../../lib/controlling/RouterBrewery");
    var BrisketRouter = require("../../../lib/controlling/Router");

    var ExampleRouter;
    var router;

    describe("#create", function() {

        it("creates Brisket router", function() {
            createRouter();

            expect(router instanceof BrisketRouter).toBe(true);
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

    function createRouter() {
        ExampleRouter = RouterBrewery.create();
        router = new ExampleRouter();
    }

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
