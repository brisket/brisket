"use strict";

var Layout = require("lib/viewing/Layout");

describe("Layout", function() {

    var ExampleLayout;
    var layout;
    var onRender;

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

    describe("#setExtraRenderInstructions", function() {

        beforeEach(function() {
            spyOn(layout, "executeExtraRenderInstructions");
            onRender = jasmine.createSpy();
        });

        forEach({
            "a string": "some string",
            "a number": 1,
            "falsy": null
        })
            .it("sets extraRenderInstructions to be null when onRender is {{NOT a function}}", function(onRender) {
                layout.setExtraRenderInstructions(onRender);
                expect(layout.extraRenderInstructions).toBeNull();
            });

        describe("when layout has been rendered", function() {

            beforeEach(function() {
                layout.hasBeenRendered = true;
                layout.setExtraRenderInstructions(onRender);
            });

            it("calls executeExtraRenderInstructions", function() {
                expect(layout.executeExtraRenderInstructions).toHaveBeenCalled();
            });

        });

        describe("when layout has NOT been rendered", function() {

            beforeEach(function() {
                layout.hasBeenRendered = false;
                layout.setExtraRenderInstructions(onRender);
            });

            it("does NOT call executeExtraRenderInstructions", function() {
                expect(layout.executeExtraRenderInstructions).not.toHaveBeenCalled();
            });

        });

    });

    describe("#executeExtraRenderInstructions", function() {

        describe("when layout has extra render instructions", function() {

            beforeEach(function() {
                layout.extraRenderInstructions = jasmine.createSpy();
                layout.executeExtraRenderInstructions();
            });

            it("calls the extraRenderInstructions with layout", function() {
                expect(layout.extraRenderInstructions).toHaveBeenCalledWith(layout);
            });

        });

        describe("when layout does NOT have extra render instructions", function() {

            beforeEach(function() {
                layout.extraRenderInstructions = null;
            });

            it("does not throw an error attempting to call extra render instructions", function() {
                var executingExtraRenderInstructionsWithoutInstructions = function() {
                    layout.executeExtraRenderInstructions();
                };

                expect(executingExtraRenderInstructionsWithoutInstructions).not.toThrow();
            });

        });

    });

});

// ----------------------------------------------------------------------------
// Copyright (C) 2014 Bloomberg L.P.
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
