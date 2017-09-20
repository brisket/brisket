"use strict";

describe("ClientRenderer", function() {
    var ClientRenderer = require("../../../lib/client/ClientRenderer");
    var Layout = require("../../../lib/viewing/Layout");
    var View = require("../../../lib/viewing/View");

    var layout;
    var view;

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

    function whenClientRenders(requestId) {
        ClientRenderer.render(layout, view, requestId);
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
