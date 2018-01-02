"use strict";

describe("Layout", function() {
    var Layout = require("../../../lib/viewing/Layout");

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

});

// ----------------------------------------------------------------------------
// Copyright (C) 2018 Bloomberg Finance L.P.
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
