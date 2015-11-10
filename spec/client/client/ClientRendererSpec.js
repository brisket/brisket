"use strict";

var ClientRenderer = require("lib/client/ClientRenderer");
var HasPageLevelData = require("lib/traits/HasPageLevelData");
var Layout = require("lib/viewing/Layout");
var View = require("lib/viewing/View");

describe("ClientRenderer", function() {

    var layout;
    var view;
    var metatags;
    var ViewWithPageLevelData;

    beforeEach(function() {
        layout = new Layout();
        spyOn(layout, "reattach");
        spyOn(layout, "render");
        spyOn(layout, "enterDOM");
        spyOn(layout, "backToNormal");
        spyOn(layout, "setContentToAttachedView");
        spyOn(layout, "setContent");
        spyOn(layout, "renderMetatags");
        spyOn(layout, "flushMetatags");

        view = new View();
        spyOn(view, "render");
        spyOn(view, "reattach");
        spyOn(view, "enterDOM");
        spyOn(view, "setUid");

        ViewWithPageLevelData = View.extend(HasPageLevelData);
    });

    describe("on all renders", function() {

        beforeEach(function() {
            ClientRenderer.render(layout, view, 1);
        });

        it("attempts to reattach view", function() {
            expect(view.reattach).toHaveBeenCalled();
        });

    });

    describe("when view is attached", function() {

        beforeEach(function() {
            view.isAttached = true;
            ClientRenderer.render(layout, view, 1);
        });

        it("renders the view", function() {
            expect(view.render).toHaveBeenCalled();
        });

        it("sets the layout's content as the attached view", function() {
            expect(layout.setContentToAttachedView).toHaveBeenCalledWith(view);
        });

        it("does NOT directly set layout's content", function() {
            expect(layout.setContent).not.toHaveBeenCalled();
        });

    });

    describe("when view is NOT attached", function() {

        beforeEach(function() {
            view.isAttached = false;
            ClientRenderer.render(layout, view, 1);
        });

        it("does NOT render the view directly", function() {
            expect(view.render).not.toHaveBeenCalled();
        });

        it("does NOT set the layout's content as the attached view", function() {
            expect(layout.setContentToAttachedView).not.toHaveBeenCalledWith(view);
        });

        it("sets the layout's content", function() {
            expect(layout.setContent).toHaveBeenCalled();
        });

    });

    describe("when view is Brisket.View", function() {

        beforeEach(function() {
            ClientRenderer.render(layout, view, 1);
        });

        it("sets uid to reflect current request and it's creation order", function() {
            expect(view.setUid).toHaveBeenCalledWith("1|0_0");
        });

    });

    describe("when layout.updateMetatagsOnClientRender is true", function() {

        beforeEach(function() {
            layout.updateMetatagsOnClientRender = true;

            metatags = {
                description: "description"
            };

            view.withMetatags(metatags);
        });

        describe("and it is the first request", function() {

            beforeEach(function() {
                ClientRenderer.render(layout, view, 1);
            });

            it("does NOT render the metatags", function() {
                expect(layout.renderMetatags).not.toHaveBeenCalledWith(metatags);
            });

            it("does NOT flush the existing metatags", function() {
                expect(layout.flushMetatags).not.toHaveBeenCalled();
            });

        });

        describe("and it is NOT the first request", function() {

            beforeEach(function() {
                ClientRenderer.render(layout, view, 2);
            });

            it("renders the metatags", function() {
                expect(layout.renderMetatags).toHaveBeenCalledWith(metatags);
            });

            it("flushes the existing metatags", function() {
                expect(layout.flushMetatags).toHaveBeenCalled();
            });

        });

    });

    describe("when layout.updateMetatagsOnClientRender is false", function() {

        beforeEach(function() {
            layout.updateMetatagsOnClientRender = false;

            metatags = {
                description: "description"
            };

            view.withMetatags(metatags);
        });

        describe("and it is the first request", function() {

            beforeEach(function() {
                ClientRenderer.render(layout, view, 1);
            });

            it("does NOT render the metatags", function() {
                expect(layout.renderMetatags).not.toHaveBeenCalledWith(metatags);
            });

            it("does NOT flush the existing metatags", function() {
                expect(layout.flushMetatags).not.toHaveBeenCalled();
            });

        });

        describe("and it is NOT the first request", function() {

            beforeEach(function() {
                ClientRenderer.render(layout, view, 2);
            });

            it("does NOT render the metatags", function() {
                expect(layout.renderMetatags).not.toHaveBeenCalledWith(metatags);
            });

            it("does NOT flush the existing metatags", function() {
                expect(layout.flushMetatags).not.toHaveBeenCalled();
            });

        });

    });

    describe("rendering page title", function() {
        var originalPageTitle;

        beforeEach(function() {
            originalPageTitle = document.title;
        });

        afterEach(function() {
            document.title = originalPageTitle;
        });

        it("does NOT change page title on initial request", function() {
            layout.defaultTitle = "Default Title";
            view = new ViewWithPageLevelData().withTitle("Title");
            ClientRenderer.render(layout, view, 1);

            expect(document.title).toBe(originalPageTitle);
        });

        describe("when layout template has title tag without attributes", function() {

            it("renders title from view's page level data", function() {
                layout.defaultTitle = "Default Title";
                view = new ViewWithPageLevelData().withTitle("Title");
                ClientRenderer.render(layout, view, 2);

                expect(document.title).toBe("Title");
            });

            it("renders layout's defaultTitle when view does NOT have page level data", function() {
                layout.defaultTitle = "Default Title";
                ClientRenderer.render(layout, view, 2);

                expect(document.title).toBe("Default Title");
            });

            it("does NOT render title when view does NOT have page level data NOR layout has defaultTitle", function() {
                ClientRenderer.render(layout, view, 2);

                expect(document.title).toBe(originalPageTitle);
            });

            it("escapes title for use in html", function() {
                layout.defaultTitle = "Title \" ' & < >";
                ClientRenderer.render(layout, view, 2);

                expect(document.title).toBe("Title \" ' & < >");
            });

            it("renders title when title tag is on multiple lines", function() {
                layout.el.innerHTML = "<html><head><title>\n</title></head><body></body></html>";
                layout.defaultTitle = "Default Title";
                ClientRenderer.render(layout, view, 2);

                expect(document.title).toBe("Default Title");
            });

        });

        describe("when layout template has title tag with attributes", function() {

            beforeEach(function() {
                layout.el.innerHTML = "<html><head><title class='klass'></title></head><body></body></html>";
            });

            it("renders title from view's page level data", function() {
                layout.defaultTitle = "Default Title";
                view = new ViewWithPageLevelData().withTitle("Title");
                ClientRenderer.render(layout, view, 2);

                expect(document.title).toBe("Title");
            });

            it("renders layout's defaultTitle when view does NOT have page level data", function() {
                layout.defaultTitle = "Default Title";
                ClientRenderer.render(layout, view, 2);

                expect(document.title).toBe("Default Title");
            });

            it("does NOT render title when view does NOT have page level data NOR layout has defaultTitle", function() {
                ClientRenderer.render(layout, view, 2);

                expect(document.title).toBe(originalPageTitle);
            });

            it("escapes title for use in html", function() {
                layout.defaultTitle = "Title \" ' & < >";
                ClientRenderer.render(layout, view, 2);

                expect(document.title).toBe("Title \" ' & < >");
            });

            it("renders title when title tag is on multiple lines", function() {
                layout.el.innerHTML = "<html><head><title class='klass'>\n</title></head><body></body></html>";
                layout.defaultTitle = "Default Title";
                ClientRenderer.render(layout, view, 2);

                expect(document.title).toBe("Default Title");
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
