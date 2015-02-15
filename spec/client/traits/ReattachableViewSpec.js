"use strict";

var ReattachableView = require("lib/traits/ReattachableView");
var Backbone = require("lib/application/Backbone");
var ViewsFromServer = require("lib/viewing/ViewsFromServer");
var $ = require("lib/application/jquery");

describe("ReattachableView", function() {

    var $fixture;
    var view;
    var ViewThatReattaches;

    describe("#reattach", function() {

        beforeEach(function() {
            givenThereAreViewsFromTheServer();

            ViewThatReattaches = Backbone.View.extend(ReattachableView);
            view = new ViewThatReattaches();
        });

        afterEach(function() {
            removeViewsFromServer();
        });

        describe("when element with view uid exists already", function() {

            beforeEach(function() {
                view.setUid("expected_uid");
            });

            it("reattaches view to element", function() {
                expect(view.$el).not.$toBe(".view-that-was-in-dom");

                view.reattach();

                expect(view.$el).$toBe(".view-that-was-in-dom");
                expect(view.$el).toBeAttachedToDom();
            });

        });

        describe("when element with view uid does NOT exist already", function() {

            beforeEach(function() {
                view.setUid("uid_for_view_not_in_dom");
            });

            it("reattaches view to element", function() {
                view.reattach();

                expect(view.$el).not.$toBe(".view-that-was-in-dom");
                expect(view.$el).not.toBeAttachedToDom();
            });

        });
    });

    describe("#hasValidUid", function() {

        beforeEach(function() {
            ViewThatReattaches = Backbone.View.extend(ReattachableView);
            view = new ViewThatReattaches();
        });

        describe("when uid is valid", function() {

            beforeEach(function() {
                view.setUid("some string with length");
            });

            it("does not have a valid uid", function() {
                expect(view.hasValidUid()).toBe(true);
            });

        });

        describe("when uid is NOT valid", function() {

            beforeEach(function() {
                view.setUid(null);
            });

            it("does not have a valid uid", function() {
                expect(view.hasValidUid()).toBe(false);
            });

        });

    });

    describe("#establishIdentity", function() {

        beforeEach(function() {
            ViewThatReattaches = Backbone.View.extend(ReattachableView);
            view = new ViewThatReattaches();
        });

        describe("when view has valid uid", function() {

            beforeEach(function() {
                view.setUid("expected_uid");
            });

            it("sets it's uid into it's el's markup so that it can be found later", function() {
                view.establishIdentity();
                expect(view.$el.attr("data-view-uid")).toBe("expected_uid");
            });

        });

        describe("when view does not have valid uid", function() {

            beforeEach(function() {
                view.setUid(null);
            });

            it("does NOT add anything to markup", function() {
                view.establishIdentity();
                expect(view.$el.attr("data-view-uid")).not.toBe("expected_uid");
            });

        });

    });

    function givenThereAreViewsFromTheServer() {
        $fixture = $(
            '<div class="dont-attach-to-me"></div>' +
            '<div class="view-that-was-in-dom" data-view-uid="expected_uid"></div>' +
            '<div class="dont-attach-to-me-either"></div>'
        ).appendTo("body");

        ViewsFromServer.initialize();
    }

    function removeViewsFromServer() {
        $fixture.remove();
        ViewsFromServer.reset();
    }

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
