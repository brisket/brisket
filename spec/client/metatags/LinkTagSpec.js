"use strict";

var LinkTag = require("lib/metatags/LinkTag");

describe("LinkTag", function() {

    describe("#createView", function() {

        var rel;

        describe("when the rel is not defined", function() {

            beforeEach(function() {
                rel = undefined;
            });

            it("throws an error", function() {
                expect(function() {
                    LinkTag.createView(rel, "href");
                }).toThrow();
            });

        });

        describe("when the rel is defined", function() {

            var view;

            beforeEach(function() {
                rel = "canonical";
                view = LinkTag.createView(rel, "example-link");
            });

            it("creates a view for the link metatag", function() {
                expect(view.el.outerHTML).toBe('<link rel="canonical" href="example-link">');
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
