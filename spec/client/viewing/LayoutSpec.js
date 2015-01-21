"use strict";

var Layout = require("lib/viewing/Layout");
var Metatags = require("lib/metatags/Metatags");

describe("Layout", function() {

    var ExampleLayout;
    var layout;

    describe("#asHtml", function() {

        beforeEach(function() {
            ExampleLayout = Layout.extend({
                template: "<!doctype html>\n<html></html>"
            });

            layout = new ExampleLayout();
        });

        describe("when template has NOT been rendered", function() {

            it("returns empty string", function() {
                expect(layout.asHtml()).toBe("");
            });

        });

        describe("when template has been rendered", function() {

            var hasDoctype = /<!doctype[^>]*>/i;

            beforeEach(function() {
                layout.renderTemplate();
            });

            describe("when template has a doctype", function() {

                it("has doctype in output html", function() {
                    expect(layout.asHtml()).toMatch(hasDoctype);
                });

            });

            describe("when template does NOT have a doctype", function() {

                beforeEach(function() {
                    ExampleLayout = Layout.extend({
                        template: "<html></html>"
                    });

                    layout = new ExampleLayout();
                });

                it("does NOT have a doctype in output html", function() {
                    expect(layout.asHtml()).not.toMatch(hasDoctype);
                });

            });

        });

    });

    describe("#isSameAs", function() {

        var Layout1;
        var Layout2;
        var layout1;
        var layout2;

        beforeEach(function() {
            Layout1 = Layout.extend();
            Layout2 = Layout.extend();
        });

        it("is NOT considered the same as an instance of it's base type", function() {
            layout1 = new Layout1();
            layout2 = new Layout();

            expect(layout1.isSameAs(layout2)).toBe(false);
        });

        describe("when one layout instance is the same type as another", function() {

            beforeEach(function() {
                layout1 = new Layout1();
                layout2 = new Layout1();
            });

            it("returns true", function() {
                expect(layout1.isSameAs(layout2)).toBe(true);
            });

        });

        describe("when one layout instance is NOT the same type as another", function() {

            beforeEach(function() {
                layout1 = new Layout1();
                layout2 = new Layout2();
            });

            it("returns false", function() {
                expect(layout1.isSameAs(layout2)).toBe(false);
            });

        });

    });

    describe("#isSameTypeAs", function() {

        var Layout1;
        var Layout2;

        beforeEach(function() {
            Layout1 = Layout.extend();
            Layout2 = Layout.extend();
        });

        it("is NOT considered the same type as it's base type", function() {
            layout = new Layout1();

            expect(layout.isSameTypeAs(Layout)).toBe(false);
        });

        describe("when a layout instance is the same type as another instance", function() {

            beforeEach(function() {
                layout = new Layout1();
            });

            it("returns true", function() {
                expect(layout.isSameTypeAs(Layout1)).toBe(true);
            });

        });

        describe("when one layout instance is NOT the same type as another instance", function() {

            beforeEach(function() {
                layout = new Layout1();
            });

            it("returns false", function() {
                expect(layout.isSameTypeAs(Layout2)).toBe(false);
            });

        });

    });

    describe("#renderPageLevelData", function() {

        var layout;
        var shouldRenderMetaTags;

        beforeEach(function() {
            layout = new Layout();
            spyOn(layout, "renderPageTitle");
            spyOn(layout, "renderMetaTags");
        });

        describe("when shouldRenderMetaTags is true", function() {

            beforeEach(function() {
                shouldRenderMetaTags = true;
                layout.renderPageLevelData(shouldRenderMetaTags);
            });

            it("renders page title", function() {
                expect(layout.renderPageTitle).toHaveBeenCalled();
            });

            it("renders metatags", function() {
                expect(layout.renderMetaTags).toHaveBeenCalled();
            });

        });

        describe("when shouldRenderMetaTags is false", function() {

            beforeEach(function() {
                shouldRenderMetaTags = false;
                layout.renderPageLevelData(shouldRenderMetaTags);
            });

            it("renders page title", function() {
                expect(layout.renderPageTitle).toHaveBeenCalled();
            });

            it("does not render metatags", function() {
                expect(layout.renderMetaTags).not.toHaveBeenCalled();
            });

        });

    });

    describe("#renderMetaTags", function() {

        var metatags;
        var renderedMetatags;

        beforeEach(function() {
            ExampleLayout = Layout.extend({
                template: "<!doctype html>\n<html><head></head></html>"
            });

            layout = new ExampleLayout();

            spyOn(layout, "createChildView").and.callThrough();
        });

        describe("when there is no metatags", function() {

            beforeEach(function() {
                layout.metatags = null;
                layout.renderMetaTags();
            });

            it("does nothing", function() {
                expect(layout.createChildView).not.toHaveBeenCalled();
            });

        });

        describe("when there are metatags but no renderedMetatags", function() {

            beforeEach(function() {
                metatags = new Metatags({
                    "description": "meta description",
                    "og:image": "example-url/image.jpg",
                    "canonical": "canonical-link.com/example-path"
                });

                layout.renderedMetatags = null;

                layout.metatags = metatags;

                layout.renderMetaTags();
            });

            it("creates all the tag views", function() {
                expect(metatags.tagViews.length).toBe(3);
            });

            it("sets the renderedMetatags", function() {
                expect(layout.renderedMetatags).toEqual(metatags);
            });

        });

        describe("when both metatags and renderedMetatags exist", function() {

            var pairs;

            beforeEach(function() {
                pairs = {
                    "description": "meta description",
                    "og:image": "example-url/image.jpg",
                    "canonical": "canonical-link.com/example-path"
                };

                metatags = new Metatags(pairs);

                layout.metatags = metatags;

                spyOn(metatags, "createTagViews").and.callThrough();
            });

            describe("they are the same", function() {

                beforeEach(function() {
                    renderedMetatags = new Metatags(pairs);

                    spyOn(renderedMetatags, "closeTagViews").and.callThrough();

                    layout.renderedMetatags = renderedMetatags;
                    layout.renderMetaTags();
                });

                it("avoids rendering again", function() {
                    expect(renderedMetatags.closeTagViews).not.toHaveBeenCalled();
                    expect(metatags.createTagViews).not.toHaveBeenCalled();
                });

            });

            describe("they are the different", function() {

                beforeEach(function() {
                    renderedMetatags = new Metatags({
                        "description": "another meta description"
                    });

                    spyOn(renderedMetatags, "closeTagViews").and.callThrough();

                    layout.renderedMetatags = renderedMetatags;
                    layout.renderMetaTags();
                });

                it("closes tagViews for renderedMetatags", function() {
                    expect(renderedMetatags.closeTagViews).toHaveBeenCalled();
                });

                it("creates new tagViews", function() {
                    expect(metatags.createTagViews).toHaveBeenCalled();
                    expect(metatags.tagViews.length).toBe(3);
                });

                it("sets the renderedMetatags", function() {
                    expect(layout.renderedMetatags).toBe(metatags);
                });

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
