"use strict";

var Controller = require("lib/controlling/Controller");
var Backbone = require("lib/application/Backbone");

describe("Controller", function() {

    var controller;
    var ExampleController;

    it("can be extended", function() {
        expect(Controller.extend).toBe(Backbone.Model.extend);
    });

    describe("when constructing", function() {

        beforeEach(function() {
            ExampleController = Controller.extend({
                initialize: jasmine.createSpy()
            });
        });

        it("it calls initialize", function() {
            controller = new ExampleController();
            expect(controller.initialize).toHaveBeenCalled();
        });

        it("it calls initialize with parameters that were passed to new", function() {
            controller = new ExampleController("a", "b");
            expect(controller.initialize).toHaveBeenCalledWith("a", "b");
        });

    });

});

// ----------------------------------------------------------------------------
// Copyright (C) 2014 Bloomberg L.P.
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
