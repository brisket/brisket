"use strict";

describe("App", function() {
    var App = require("../../../lib/application/App");
    var Environment = require("../../../lib/environment/Environment");

    var initializer;
    var startConfig;

    beforeEach(function() {
        startConfig = {};
        initializer = jasmine.createSpy();
    });

    afterEach(function() {
        App.reset();
    });

    describe("when on the server", function() {

        beforeEach(function() {
            spyOn(Environment, "isServer").and.returnValue(true);
        });

        it("runs initializers", function() {
            App.addInitializer(initializer);

            App.initialize(startConfig);

            expect(initializer).toHaveBeenCalledWith(startConfig);
        });

        it("runs server initializers", function() {
            App.addServerInitializer(initializer);

            App.initialize(startConfig);

            expect(initializer).toHaveBeenCalledWith(startConfig);
        });

        it("does NOT run client initializers", function() {
            App.addClientInitializer(initializer);

            App.initialize(startConfig);

            expect(initializer).not.toHaveBeenCalled();
        });

        it("runs initializers and server initializers in the order they were added", function() {
            var order = [];

            function identifyAs(number) {
                return function() {
                    order.push(number);
                };
            }

            App.addInitializer(identifyAs(1));
            App.addServerInitializer(identifyAs(2));
            App.addServerInitializer(identifyAs(3));
            App.addInitializer(identifyAs(4));

            App.initialize(startConfig);

            expect(order).toEqual([1, 2, 3, 4]);
        });

    });

    describe("when on the client", function() {

        beforeEach(function() {
            spyOn(Environment, "isServer").and.returnValue(false);
        });

        it("runs initializers", function() {
            App.addInitializer(initializer);

            App.initialize(startConfig);

            expect(initializer).toHaveBeenCalledWith(startConfig);
        });

        it("does NOT run server initializers", function() {
            App.addServerInitializer(initializer);

            App.initialize(startConfig);

            expect(initializer).not.toHaveBeenCalled();
        });

        it("runs client initializers", function() {
            App.addClientInitializer(initializer);

            App.initialize(startConfig);

            expect(initializer).toHaveBeenCalledWith(startConfig);
        });

        it("runs initializers and client initializers in the order they were added", function() {
            var order = [];

            function identifyAs(number) {
                return function() {
                    order.push(number);
                };
            }

            App.addInitializer(identifyAs(1));
            App.addClientInitializer(identifyAs(2));
            App.addClientInitializer(identifyAs(3));
            App.addInitializer(identifyAs(4));

            App.initialize(startConfig);

            expect(order).toEqual([1, 2, 3, 4]);
        });

    });

});

// ----------------------------------------------------------------------------
// Copyright (C) 2018 Bloomberg Finance L.P.
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
