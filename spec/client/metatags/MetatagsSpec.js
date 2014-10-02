"use strict";

var Metatags = require("lib/metatags/Metatags");

describe("Metatags", function() {

    var metatags;

    describe("creating Metatags", function() {

        describe("when pairs are not passed", function() {

            it("throws", function() {
                var instantiatingMetatagsWithoutPairs = function() {
                    new Metatags();
                };

                expect(instantiatingMetatagsWithoutPairs).toThrow();
            });

        });

    });

    describe("when normal pairs are present", function() {

        beforeEach(function() {
            metatags = new Metatags({
                "description": "some description"
            });
        });

        it("creates tags with name attribute", function() {
            expect(metatags.toTags()).toBe(
                '<meta name="description" content="some description">'
            );
        });

    });

    describe("when openGraph pairs are present", function() {

        beforeEach(function() {
            metatags = new Metatags({
                openGraph: {
                    "og:image": "image.jpg"
                }
            });
        });

        it("creates tags with property attribute", function() {
            expect(metatags.toTags()).toBe(
                '<meta property="og:image" content="image.jpg">'
            );
        });

    });

    describe("when values have characters that could break html", function() {

        beforeEach(function() {
            metatags = new Metatags({
                "key": "/value><"
            });
        });

        it("escapes html breaking characters", function() {
            expect(metatags.toTags()).toBe(
                '<meta name="key" content="/value&gt;&lt;">'
            );
        });

    });

    describe("when values have single quotes", function() {

        beforeEach(function() {
            metatags = new Metatags({
                "key": "'quote'"
            });
        });

        it("escapes single quotes", function() {
            expect(metatags.toTags()).toBe(
                '<meta name="key" content="&#x27;quote&#x27;">'
            );
        });
    });

    describe("when values have double quotes", function() {

        beforeEach(function() {
            metatags = new Metatags({
                "key": '"quote"'
            });
        });

        it("escapes double quotes", function() {
            expect(metatags.toTags()).toBe(
                '<meta name="key" content="&quot;quote&quot;">'
            );
        });
    });

});

// ----------------------------------------------------------------------------
// Copyright (C) 2014 Bloomberg Finance L.P.
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
