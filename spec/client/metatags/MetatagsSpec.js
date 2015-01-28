"use strict";

var Metatags = require("lib/metatags/Metatags");

describe("Metatags", function() {

    var metatags;

    describe("instantiation", function() {

        describe("when pairs are NOT provided", function() {

            function instantiateMetatagsWithoutPairs() {
                return new Metatags();
            }

            it("throws an error", function() {
                expect(instantiateMetatagsWithoutPairs).toThrow();
            });

        });

        describe("when pairs are provided", function() {

            beforeEach(function() {
                metatags = new Metatags({
                    "description": "desc",
                    "og:image": "a.jpg",
                    "canonical": "a.com/c"
                });
            });

            it("sets html property to markup of metatags", function() {
                expect(metatags.html).toEqual(
                    '<meta name="description" content="desc" data-ephemeral="true">' +
                    '<meta property="og:image" content="a.jpg" data-ephemeral="true">' +
                    '<link rel="canonical" href="a.com/c" data-ephemeral="true">'
                );
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
