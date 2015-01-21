"use strict";

var OpenGraphTag = require("lib/metatags/OpenGraphTag");

describe("OpenGraphTag", function() {

    describe("#createView", function() {

        var property;

        describe("when the property is not defined", function() {

            beforeEach(function() {
                property = undefined;
            });

            it("throws an error", function() {
                expect(function() {
                    OpenGraphTag.createView(property, "content");
                }).toThrow();
            });

        });

        describe("when the property is defined", function() {

            var view;

            beforeEach(function() {
                property = "og:url";
                view = OpenGraphTag.createView(property, "http://example.com");
            });

            it("creates a view for the open graph metatag", function() {
                expect(view.el.outerHTML).toBe('<meta property="og:url" content="http://example.com">');
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
