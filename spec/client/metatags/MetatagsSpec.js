"use strict";

describe("Metatags", function() {
    var Metatags = require("../../../lib/metatags/Metatags");

    var metatags;
    var tags;

    describe("normal metatags", function() {

        itRequiresPairs(Metatags.NormalTags);

        describe("when pairs are provided", function() {

            beforeEach(function() {
                metatags = new Metatags.NormalTags({
                    "description": "desc",
                    "og:image": "a.jpg",
                    "canonical": "a.com/c"
                });
            });

            it("#asHtml", function() {
                expect(metatags.asHtml()).toEqual(
                    '<meta name="description" content="desc" data-ephemeral="true">' +
                    '<meta property="og:image" content="a.jpg" data-ephemeral="true">' +
                    '<link rel="canonical" href="a.com/c" data-ephemeral="true">'
                );
            });

            it("#asTags", function() {
                tags = metatags.asTags();

                expect(tags.querySelector("[name='description'][content='desc']")).toBeDefined();
                expect(tags.querySelector("[property='og:image'][content='a.jpg']")).toBeDefined();
                expect(tags.querySelector("[rel='canonical'][href='a.com/c']")).toBeDefined();
            });

        });

    });

    describe("opengraph metatags", function() {

        itRequiresPairs(Metatags.OpenGraphTags);

        describe("when pairs are provided", function() {

            beforeEach(function() {
                metatags = new Metatags.OpenGraphTags({
                    "og:image": "a.jpg"
                });
            });

            it("#asHtml", function() {
                expect(metatags.asHtml()).toEqual(
                    '<meta property="og:image" content="a.jpg" data-ephemeral="true">'
                );
            });

            it("#asTags", function() {
                tags = metatags.asTags();

                expect(tags.querySelector("[property='og:image'][content='a.jpg']")).toBeDefined();
            });

        });

    });

    describe("link tags", function() {

        itRequiresPairs(Metatags.LinkTags);

        describe("when pairs are provided", function() {

            beforeEach(function() {
                metatags = new Metatags.LinkTags({
                    "canonical": "a.com/c"
                });
            });

            it("#asHtml", function() {
                expect(metatags.asHtml()).toEqual(
                    '<link rel="canonical" href="a.com/c" data-ephemeral="true">'
                );
            });

            it("#asTags", function() {
                tags = metatags.asTags();

                expect(tags.querySelector("[rel='canonical'][href='a.com/c']")).toBeDefined();
            });

        });

    });

    function itRequiresPairs(Type) {
        it("throws an error when pairs are NOT provided", function() {
            function instantiateMetatagsWithoutPairs() {
                return new Type();
            }

            expect(instantiateMetatagsWithoutPairs).toThrow();
        });
    }

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
