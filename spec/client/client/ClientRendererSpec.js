"use strict";

var ClientRenderer = require("lib/client/ClientRenderer");
var Layout = require("lib/viewing/Layout");
var View = require("lib/viewing/View");

describe("ClientRenderer", function() {

    var layout;
    var view;
    var onRender;

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

        onRender = jasmine.createSpy();
    });

    describe("on all renders", function() {

        beforeEach(function() {
            ClientRenderer.render(layout, false, view, onRender, 1);
        });

        it("attempts to reattach view", function() {
            expect(view.reattach).toHaveBeenCalled();
        });

        it("alerts view that it is in the DOM", function() {
            expect(view.enterDOM).toHaveBeenCalled();
        });

    });

    describe("when it should initialize layout", function() {

        beforeEach(function() {
            ClientRenderer.render(layout, true, view, onRender, 1);
        });

        it("should reattach layout", function() {
            expect(layout.reattach).toHaveBeenCalled();
        });

        it("should render layout", function() {
            expect(layout.render).toHaveBeenCalled();
        });

        it("should enterDOM layout", function() {
            expect(layout.enterDOM).toHaveBeenCalled();
        });

    });

    describe("when it should NOT initialize layout", function() {

        beforeEach(function() {
            ClientRenderer.render(layout, false, view, onRender, 1);
        });

        it("should reattach layout", function() {
            expect(layout.reattach).not.toHaveBeenCalled();
        });

        it("should render layout", function() {
            expect(layout.render).not.toHaveBeenCalled();
        });

        it("should enterDOM layout", function() {
            expect(layout.enterDOM).not.toHaveBeenCalled();
        });

    });

    describe("when view is attached", function() {

        beforeEach(function() {
            view.isAttached = true;
            ClientRenderer.render(layout, false, view, onRender, 1);
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
            ClientRenderer.render(layout, false, view, onRender, 1);
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
            ClientRenderer.render(layout, false, view, onRender, 1);
        });

        it("sets uid to reflect current request and it's creation order", function() {
            expect(view.setUid).toHaveBeenCalledWith("1|0_0");
        });

    });

    describe("setting extra render instructions in layout", function() {

        beforeEach(function() {
            layout.render.andCallThrough();
        });

        describe("when should initialize layout AND layout has NOT been rendered yet", function() {

            beforeEach(function() {
                layout.hasBeenRendered = false;
                ClientRenderer.render(layout, true, view, onRender, 1);
            });

            it("resets layout to normal", function() {
                expect(layout.backToNormal).toHaveBeenCalled();
            });

            it("calls onRender with the layout", function() {
                expect(onRender).toHaveBeenCalledWith(layout);
            });

        });

        describe("when should NOT initialize layout AND it has already been rendered", function() {

            beforeEach(function() {
                layout.hasBeenRendered = true;
                ClientRenderer.render(layout, false, view, onRender, 1);
            });

            it("resets layout to normal", function() {
                expect(layout.backToNormal).toHaveBeenCalled();
            });

            it("calls onRender with the layout", function() {
                expect(onRender).toHaveBeenCalledWith(layout);
            });

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
