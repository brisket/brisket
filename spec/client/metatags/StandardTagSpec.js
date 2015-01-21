"use strict";

var StandardTag = require("lib/metatags/StandardTag");

describe("StandardTag", function() {

    describe("#createView", function() {

        var name;

        describe("when the name is not defined", function() {

            beforeEach(function() {
                name = undefined;
            });

            it("throws an error", function() {
                expect(function() {
                    StandardTag.createView(name, "content");
                }).toThrow();
            });

        });

        describe("when the name is defined", function() {

            var view;

            beforeEach(function() {
                name = "description";
                view = StandardTag.createView(name, "example desc");
            });

            it("creates a view for the StandardTag", function() {
                expect(view.el.outerHTML).toBe('<meta name="description" content="example desc">');
            });

        });

    });

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
