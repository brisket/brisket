"use strict";

describe("ClientRenderer", function() {
    var ClientRenderer = require("../../../lib/client/ClientRenderer");
    var HasPageLevelData = require("../../../lib/traits/HasPageLevelData");
    var Layout = require("../../../lib/viewing/Layout");
    var View = require("../../../lib/viewing/View");
    var $ = require("../../../lib/application/jquery");

    var layout;
    var view;
    var metatags;
    var ViewWithPageLevelData;
    var originalMetatag;
    var head;
    var $brisketMetatags;

    beforeEach(function() {
        layout = new Layout();
        spyOn(layout, "reattach");
        spyOn(layout, "render");
        spyOn(layout, "enterDOM");
        spyOn(layout, "backToNormal");
        spyOn(layout, "setContentToAttachedView");
        spyOn(layout, "setContent");

        view = new View();
        spyOn(view, "render");
        spyOn(view, "reattach");
        spyOn(view, "enterDOM");
        spyOn(view, "setUid");

        ViewWithPageLevelData = View.extend(HasPageLevelData);

        originalMetatag = document.createElement("meta");
        originalMetatag.setAttribute("data-ephemeral", true);

        head = document.head;
        head.appendChild(originalMetatag);
    });

    afterEach(function() {
        $brisketMetatags.remove();
    });

    describe("on all renders", function() {

        beforeEach(function() {
            whenClientRenders(1);
        });

        it("attempts to reattach view", function() {
            expect(view.reattach).toHaveBeenCalled();
        });

    });

    describe("when view is attached", function() {

        beforeEach(function() {
            view.isAttached = true;
            whenClientRenders(1);
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
            whenClientRenders(1);
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
            whenClientRenders(1);
        });

        it("sets uid to reflect current request and it's creation order", function() {
            expect(view.setUid).toHaveBeenCalledWith("1|0_1");
        });

    });

    describe("when layout.updateMetatagsOnClientRender is true", function() {

        beforeEach(function() {
            layout.updateMetatagsOnClientRender = true;

            view.withMetatags(new Layout.Metatags({
                description: "description"
            }));
        });

        describe("and it is the first request", function() {

            beforeEach(function() {
                whenClientRenders(1);
            });

            it("does NOT modify metatags", function() {
                expectMetatagsDidntChange();
            });

        });

        describe("and it is NOT the first request", function() {

            beforeEach(function() {
                whenClientRenders(2);
            });

            it("renders the new metatags", function() {
                expectNormalMetatag("description", "description");
            });

            it("flushes the existing metatags", function() {
                expectExistingMetatagFlushed();
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
                whenClientRenders(1);
            });

            it("does NOT modify metatags", function() {
                expectMetatagsDidntChange();
            });

        });

        describe("and it is NOT the first request", function() {

            beforeEach(function() {
                whenClientRenders(2);
            });

            it("does NOT modify metatags", function() {
                expectMetatagsDidntChange();
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
            whenClientRenders(1);

            expect(document.title).toBe(originalPageTitle);
        });

        describe("when layout template has title tag without attributes", function() {

            it("renders title from view's page level data", function() {
                layout.defaultTitle = "Default Title";
                view = new ViewWithPageLevelData().withTitle("Title");
                whenClientRenders(2);

                expect(document.title).toBe("Title");
            });

            it("renders layout's defaultTitle when view does NOT have page level data", function() {
                layout.defaultTitle = "Default Title";
                whenClientRenders(2);

                expect(document.title).toBe("Default Title");
            });

            it("does NOT render title when view does NOT have page level data NOR layout has defaultTitle", function() {
                whenClientRenders(2);

                expect(document.title).toBe(originalPageTitle);
            });

            it("escapes title for use in html", function() {
                layout.defaultTitle = "Title \" ' & < > $ $$ $' $` $& $3";
                whenClientRenders(2);

                expect(document.title).toBe("Title \" ' & < > $ $$ $' $` $& $3");
            });

            it("renders title when title tag is on multiple lines", function() {
                layout.el.innerHTML = "<html><head><title>\n</title></head><body></body></html>";
                layout.defaultTitle = "Default Title";
                whenClientRenders(2);

                expect(document.title).toBe("Default Title");
            });

            it("doesn't change title when there is no defaultTitle", function() {
                whenClientRenders(1);
                expect(document.title).toBe(originalPageTitle);

                view = new View();
                whenClientRenders(2);
                expect(document.title).toBe(originalPageTitle);
            });

        });

        describe("when layout template has title tag with attributes", function() {

            beforeEach(function() {
                layout.el.innerHTML = "<html><head><title class='klass'></title></head><body></body></html>";
            });

            it("renders title from view's page level data", function() {
                layout.defaultTitle = "Default Title";
                view = new ViewWithPageLevelData().withTitle("Title");
                whenClientRenders(2);

                expect(document.title).toBe("Title");
            });

            it("renders layout's defaultTitle when view does NOT have page level data", function() {
                layout.defaultTitle = "Default Title";
                whenClientRenders(2);

                expect(document.title).toBe("Default Title");
            });

            it("does NOT render title when view does NOT have page level data NOR layout has defaultTitle", function() {
                whenClientRenders(2);

                expect(document.title).toBe(originalPageTitle);
            });

            it("escapes title for use in html", function() {
                layout.defaultTitle = "Title \" ' & < > $ $$ $' $` $& $3";
                whenClientRenders(2);

                expect(document.title).toBe("Title \" ' & < > $ $$ $' $` $& $3");
            });

            it("renders title when title tag is on multiple lines", function() {
                layout.el.innerHTML = "<html><head><title class='klass'>\n</title></head><body></body></html>";
                layout.defaultTitle = "Default Title";
                whenClientRenders(2);

                expect(document.title).toBe("Default Title");
            });

        });

    });

    describe("rendering metatags", function() {

        beforeEach(function() {
            layout.updateMetatagsOnClientRender = true;
        });

        describe("when there are no metatags", function() {

            beforeEach(function() {
                view = new ViewWithPageLevelData();
                whenClientRenders(2);
            });

            it("does nothing", function() {
                expectMetatagsDidntChange();
            });

        });

        describe("when there is only 1 group of metatags", function() {

            beforeEach(function() {
                view = new ViewWithPageLevelData()
                    .withMetatags(new Layout.Metatags({
                        "description": "a",
                        "keywords": "b"
                    }));

                whenClientRenders(2);
            });

            it("renders metatags into html", function() {
                expectNormalMetatag("description", "a");
                expectNormalMetatag("keywords", "b");
            });

        });

        describe("when there are many groups of metatags", function() {

            beforeEach(function() {
                view = new ViewWithPageLevelData()
                    .withMetatags([
                        new Layout.Metatags({
                            "description": "a",
                            "keywords": "b"
                        }),
                        new Layout.OpenGraphTags({
                            "og:image": "b"
                        }),
                        new Layout.LinkTags({
                            "canonical": "c"
                        })
                    ]);

                whenClientRenders(2);
            });

            it("renders metatags into html", function() {
                expectNormalMetatag("description", "a");
                expectNormalMetatag("keywords", "b");
                expectOpenGraphTag("og:image", "b");
                expectLinkTag("canonical", "c");
            });

        });

    });

    function whenClientRenders(requestId) {
        ClientRenderer.render(layout, view, requestId);
        $brisketMetatags = $(head).children("[data-ephemeral]");
    }

    function expectMetatagsDidntChange() {
        expect(originalMetatag.parentNode).toBe(head);
        expect($brisketMetatags.length).toBe(1);
    }

    function expectExistingMetatagFlushed() {
        expect(originalMetatag.parentNode).not.toBe(head);
        expect($brisketMetatags.length).toBe(1);
    }

    function expectNormalMetatag(name, content) {
        expect($brisketMetatags.filter("meta[name='" + name + "'][content='" + content + "']")).toExist();
    }

    function expectOpenGraphTag(name, content) {
        expect($brisketMetatags.filter("meta[property='" + name + "'][content='" + content + "']")).toExist();
    }

    function expectLinkTag(name, content) {
        expect($brisketMetatags.filter("link[rel='" + name + "'][href='" + content + "']")).toExist();
    }

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
