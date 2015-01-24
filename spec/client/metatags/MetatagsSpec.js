"use strict";

var Metatags = require("lib/metatags/Metatags");
var OpenGraphTag = require("lib/metatags/OpenGraphTag");
var LinkTag = require("lib/metatags/LinkTag");
var StandardTag = require("lib/metatags/StandardTag");

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

        describe("when pairs are passed", function() {

            beforeEach(function() {
                metatags = new Metatags({
                    "description": "meta desc"
                });
            });

            it("initializes the pairs attribute", function() {
                expect(metatags.pairs).toEqual({
                    "description": "meta desc"
                });
            });

            it("initializes the tagViews attributes", function() {
                expect(metatags.tagViews).toEqual([]);
            });

        });

    });

    describe("#createTagView", function() {

        var tagName;
        var tagValue;

        beforeEach(function() {
            metatags = new Metatags({
                "description": "meta desc"
            });

            spyOn(OpenGraphTag, "createView");
            spyOn(LinkTag, "createView");
            spyOn(StandardTag, "createView");
        });

        describe("when it is an open-graph tag", function() {

            beforeEach(function() {
                tagName = "og:url";
                tagValue = "sample-og-url";

                metatags.createTagView(tagName, tagValue);
            });

            it("creates a view for OpenGraphTag", function() {
                expect(OpenGraphTag.createView)
                    .toHaveBeenCalledWith(tagName, tagValue);
            });

        });

        describe("when it is a canonical link tag", function() {

            beforeEach(function() {
                tagName = "canonical";
                tagValue = "canonical-link";

                metatags.createTagView(tagName, tagValue);
            });

            it("creates a view for LinkTag", function() {
                expect(LinkTag.createView)
                    .toHaveBeenCalledWith(tagName, tagValue);
            });

        });

        describe("when it is a standard meta tag", function() {

            beforeEach(function() {
                tagName = "keywords";
                tagValue = "sample keywords";

                metatags.createTagView(tagName, tagValue);
            });

            it("creates a view for StandardTag", function() {
                expect(StandardTag.createView)
                    .toHaveBeenCalledWith(tagName, tagValue);
            });

        });

    });

    describe("#createTagViews", function() {

        var tagViews;

        beforeEach(function() {
            metatags = new Metatags({
                "description": "sample desc",
                "og:url": "sample url"
            });

            tagViews = metatags.createTagViews();
        });

        describe("when called the first time", function() {

            it("creates a tag view for each key-value pair", function() {
                expect(tagViews.length).toBe(2);
            });

        });

        describe("when called after the tagViews have been created", function() {

            var recreatedTagViews;

            beforeEach(function() {
                recreatedTagViews = metatags.createTagViews();
            });

            it("returns the existing tagViews", function() {
                expect(recreatedTagViews).toEqual(tagViews);
            });

        });

    });

    describe("#closeTagViews", function() {

        var tagView1;
        var tagView2;

        beforeEach(function() {
            tagView1 = OpenGraphTag.createView("og:url", "sample url");
            tagView2 = StandardTag.createView("description", "sample desc");

            spyOn(tagView1, "close");
            spyOn(tagView2, "close");

            metatags.tagViews = [tagView1, tagView2];

            metatags.closeTagViews();
        });

        it("closes all tag views", function() {
            expect(tagView1.close).toHaveBeenCalled();
            expect(tagView2.close).toHaveBeenCalled();
        });

        it("resets attribute tagViews", function() {
            expect(metatags.tagViews).toEqual([]);
        });

    });

    describe("#sameAs", function() {

        var metatagsToCompare;

        beforeEach(function() {
            metatags = new Metatags({
                "keywords": "some keywords"
            });
        });

        describe("when the metatagsToCompare is undefined", function() {

            beforeEach(function() {
                metatagsToCompare = null;
            });

            it("returns false", function() {
                expect(metatags.sameAs(metatagsToCompare)).toBe(false);
            });

        });

        describe("when the metatagsToCompare is different", function() {

            beforeEach(function() {
                metatagsToCompare = new Metatags({
                    "keywords": "other keywords"
                });
            });

            it("returns false", function() {
                expect(metatags.sameAs(metatagsToCompare)).toBe(false);
            });

        });

        describe("when the metatagsToCompare has the same pairs", function() {

            beforeEach(function() {
                metatagsToCompare = new Metatags({
                    "keywords": "some keywords"
                });
            });

            it("returns false", function() {
                expect(metatags.sameAs(metatagsToCompare)).toBe(true);
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
