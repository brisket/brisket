"use strict";

describe("View on server", function() {
    var View = require("../../../lib/viewing/View");
    var Backbone = require("../../../lib/application/Backbone");
    var noop = require("../../../lib/util/noop");

    var ExampleView;
    var ChildViewsInTemplate;
    var view;
    var childView1;
    var childView2;
    var childView3;

    it("overwrites delegateEvents", function() {
        expect(View.prototype.delegateEvents).not.toBe(Backbone.View.prototype.delegateEvents);
    });

    it("overwrites undelegateEvents", function() {
        expect(View.prototype.undelegateEvents).not.toBe(Backbone.View.prototype.undelegateEvents);
    });

    describe("Backbone events", function() {

        beforeEach(function() {
            ExampleView = View.extend({
                events: {
                    "click .sample-element": "noop"
                },

                noop: noop
            });

            view = new ExampleView();
        });

        it("does not call delegateEvents", function() {
            spyOn(Backbone.View.prototype, "delegateEvents");
            view.delegateEvents();
            expect(Backbone.View.prototype.delegateEvents).not.toHaveBeenCalled();
        });

        it("does not call undelegateEvents", function() {
            spyOn(Backbone.View.prototype, "undelegateEvents");
            view.undelegateEvents();
            expect(Backbone.View.prototype.undelegateEvents).not.toHaveBeenCalled();
        });
    });

    describe("when rendering", function() {

        describe("when it has child views placed directly in template", function() {

            beforeEach(function() {
                childView1 = new Backbone.View({
                    className: "child1"
                });
                childView2 = new Backbone.View({
                    className: "child2"
                });
                childView3 = new Backbone.View({
                    className: "child3"
                });

                ChildViewsInTemplate = View.extend({
                    template: function(data) {
                        var views = data.views;

                        return "<div class='first'></div>" +
                            views.child1 +
                            "<div class='third'></div>" +
                            views.child2 +
                            "<div class='fifth'></div>" +
                            views.child3;
                    },

                    beforeRender: function() {
                        this.createChildView("child1", childView1);
                        this.createChildView("child2", childView2);
                        this.createChildView("child3", childView3);
                    }

                });

                view = new ChildViewsInTemplate();

                view.render();
            });

            it("renders child views exactly where they had been placed in template", function() {
                expect(view.$(".first").next().hasClass("child1")).toBe(true);
                expect(view.$(".third").next().hasClass("child2")).toBe(true);
                expect(view.$(".fifth").next().hasClass("child3")).toBe(true);
            });

        });

    });

});

// ----------------------------------------------------------------------------
// Copyright (C) 2016 Bloomberg Finance L.P.
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
