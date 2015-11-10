"use strict";

describe("Layout", function() {
    var Layout = require("../../../lib/viewing/Layout");
    var Metatags = require("../../../lib/metatags/Metatags");
    var OpenGraphTags = require("../../../lib/metatags/OpenGraphTags");
    var LinkTags = require("../../../lib/metatags/LinkTags");
    var ExampleLayout;
    var layout;

    beforeEach(function() {
        ExampleLayout = Layout.extend({
            template: "<!doctype html>\n" +
                "<html data-type='html'>\n" +
                "\t<head data-type='head'>\n" +
                "\t\t<title>original</title>\n" +
                "\t</head>\n" +
                "\t<body class='layout'>\n" +
                "\t</body>\n" +
                "</html>"
        });

        layout = new ExampleLayout();
    });

    describe("#asHtml", function() {

        describe("when template has NOT been rendered", function() {

            it("returns empty html element", function() {
                expect(layout.asHtml()).toBe("<html></html>");
            });

        });

        describe("when template has been rendered", function() {

            var hasDoctype = /<!doctype[^>]*>/i;
            var preservesAttributesInHtmlTag = /<html data-type='html'>/i;
            var preservesAttributesInBodyTag = /<body class="layout">/i;
            var preservesAttributesInHeadTag = /<head data-type="head">/i;

            beforeEach(function() {
                layout.renderTemplate();
            });

            it("preserves attributes on html tag", function() {
                expect(layout.asHtml()).toMatch(preservesAttributesInHtmlTag);
            });

            it("preserves attributes on body tag", function() {
                expect(layout.asHtml()).toMatch(preservesAttributesInBodyTag);
            });

            it("preserves attributes on head tag", function() {
                expect(layout.asHtml()).toMatch(preservesAttributesInHeadTag);
            });

            it("renders one html tag", function() {
                expect(layout.asHtml().match(/<html[^>]*>/ig).length).toEqual(1);
            });

            it("renders one head tag", function() {
                expect(layout.asHtml().match(/<head[^>]*>/ig).length).toEqual(1);
            });

            it("renders one body tag", function() {
                expect(layout.asHtml().match(/<body[^>]*>/ig).length).toEqual(1);
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

    describe("#flushMetatags", function() {

        beforeEach(function() {
            layout.renderTemplate();
        });

        describe("when there are NO ephemeral metatags", function() {

            beforeEach(function() {
                layout.flushMetatags();
            });

            it("does nothing", function() {
                expect(layout.$head().html()).toBeHTMLEqual(
                    "<title>original</title>"
                );
            });

        });

        describe("when there are ephemeral metatags", function() {

            beforeEach(function() {
                layout.$head().append(
                    "<meta name='description' content='ephemeral summary' data-ephemeral='true'>" +
                    "<meta name='description' content='summary'>"
                );

                layout.flushMetatags();
            });

            it("removes ephemeral metatags", function() {
                expect(layout.$head().html()).toBeHTMLEqual(
                    '<title>original</title>' +
                    '<meta name="description" content="summary">'
                );
            });

        });

    });

    describe("#renderMetatags", function() {

        beforeEach(function() {
            layout.renderTemplate();
        });

        describe("when there are no metatags", function() {

            beforeEach(function() {
                layout.renderMetatags(null);
            });

            it("does nothing", function() {
                expect(layout.$head().html()).toBeHTMLEqual(
                    "<title>original</title>"
                );
            });

        });

        describe("when there is one set of metatags", function() {
            var metatags;

            beforeEach(function() {
                metatags = new Metatags({
                    "description": "a",
                    "keywords": "b"
                });

                layout.renderMetatags(metatags);
            });

            it("appends metatags to the head", function() {
                expect(layout.$head().html()).toBeHTMLEqual(
                    '<title>original</title>' +
                    '<meta name="description" content="a" data-ephemeral="true">' +
                    '<meta name="keywords" content="b" data-ephemeral="true">'
                );
            });
        });

        describe("when there are multiple metatags", function() {

            beforeEach(function() {
                layout.renderMetatags([
                    new Metatags({
                        "description": "a",
                        "keywords": "b"
                    }),
                    new OpenGraphTags({
                        "og:image": "b"
                    }),
                    new LinkTags({
                        "canonical": "c"
                    })
                ]);
            });

            it("appends metatags to the head", function() {
                expect(layout.$head().html()).toBeHTMLEqual(
                    '<title>original</title>' +
                    '<meta name="description" content="a" data-ephemeral="true">' +
                    '<meta name="keywords" content="b" data-ephemeral="true">' +
                    '<meta property="og:image" content="b" data-ephemeral="true">' +
                    '<link rel="canonical" href="c" data-ephemeral="true">'
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
