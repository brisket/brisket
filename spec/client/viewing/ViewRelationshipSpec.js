"use strict";

var Backbone = require("lib/application/Backbone");
var View = require("lib/viewing/View");
var ViewRelationship = require("lib/viewing/ViewRelationship");

describe("ViewRelationshipSpec", function() {

    var ChildView;
    var childView;
    var ParentView;
    var parentView;
    var viewRelationship;

    beforeEach(function() {
        ParentView = View.extend({
            template: "<div class='first'></div>" +
                "<div class='descendant'></div>" +
                "<div class='last'></div>"
        });
        parentView = new ParentView();
        ChildView = Backbone.View.extend();
        viewRelationship = new ViewRelationship(ChildView, parentView);
    });

    describe("#andPlace", function() {

        describe("when parent view has NOT been rendered", function() {

            it("does not place child view", function() {
                childView = new ChildView();

                placeChildView();
                expect(parentView.$(childView.el)).not.toExist();
            });

            it("records child view as unrendered", function() {
                expectParentUnrenderedChildCountToBe(0);

                placeChildView();
                expectParentUnrenderedChildCountToBe(1);

                placeChildView();
                expectParentUnrenderedChildCountToBe(2);
            });

        });

        describe("when parent view has been rendered", function() {

            beforeEach(function() {
                parentView.render();
                spyOn(viewRelationship, "enterDOM");
            });

            describe("when parent view has already attached to an existing element in the DOM", function() {

                describe("when child view is a Brisket view", function() {

                    beforeEach(function() {
                        ChildView = View.extend();
                        viewRelationship = new ViewRelationship(ChildView, parentView);

                        parentView.isAttached = true;
                        spyOn(ChildView.prototype, "render");
                        spyOn(ChildView.prototype, "reattach");
                        spyOn(viewRelationship, "renderChildViewIntoParent");
                    });

                    it("reattaches child view", function() {
                        viewRelationship.andAppendIt();
                        expect(ChildView.prototype.reattach).toHaveBeenCalled();
                    });

                    describe("when child view is already in the DOM", function() {

                        beforeEach(function() {
                            ChildView.prototype.isAttached = true;
                            viewRelationship.andAppendIt();
                        });

                        it("renders child view so that it's render workflow fires", function() {
                            expect(ChildView.prototype.render).toHaveBeenCalled();
                        });

                        it("does NOT render child view into parent view", function() {
                            expect(viewRelationship.renderChildViewIntoParent).not.toHaveBeenCalled();
                        });

                    });

                    describe("when child view is NOT already in the DOM", function() {

                        beforeEach(function() {
                            ChildView.prototype.isAttached = false;
                            viewRelationship.andAppendIt();
                        });

                        it("does renders child view into parent view", function() {
                            expect(viewRelationship.renderChildViewIntoParent).toHaveBeenCalled();
                        });

                    });

                });

                describe("when child view is NOT a Brisket View", function() {

                    beforeEach(function() {
                        parentView.render();
                        parentView.isAttached = true;
                        spyOn(viewRelationship, "renderChildViewIntoParent");
                    });

                    it("does NOT throw an error trying to reattach the child view", function() {
                        var creatingChildView = function() {
                            viewRelationship.andAppendIt();
                        };

                        expect(creatingChildView).not.toThrow();
                    });

                    it("renders child view into parent view", function() {
                        viewRelationship.andAppendIt();
                        expect(viewRelationship.renderChildViewIntoParent).toHaveBeenCalled();
                    });

                });

            });

            describe("when parent view is in the DOM", function() {

                beforeEach(function() {
                    parentView.render();
                    parentView.enterDOM();
                    viewRelationship.andPlace(".destination", "append");
                });

                it("enters the child view into the DOM", function() {
                    expect(viewRelationship.enterDOM).toHaveBeenCalled();
                });

            });

            describe("when parent view is NOT in the DOM", function() {

                beforeEach(function() {
                    viewRelationship.andPlace(".destination", "append");
                });

                it("does NOT enter the child view into the DOM", function() {
                    expect(viewRelationship.enterDOM).not.toHaveBeenCalled();
                });

            });
        });

    });

    describe("when placing child views", function() {

        beforeEach(function() {
            childView = new ChildView();
        });

        describe("when parent view has been rendered", function() {

            beforeEach(function() {
                parentView.render();
            });

            it("appends a child view", function() {
                parentView.createChildView(childView).andAppendIt();

                expect($lastElement().next()).toBe(childView.el);
            });

            it("inserts a child view into a descendant element", function() {
                parentView.createChildView(childView).andInsertInto(".descendant");

                expect($descendantElement().children()).toBe(childView.$el);
            });

            it("inserts a child view after a descendant element", function() {
                parentView.createChildView(childView).andInsertAfter(".descendant");

                expect($descendantElement().next()).toBe(childView.$el);
            });

            it("replaces a descendant element with a child view", function() {
                var $descendantElementPrev = $descendantElement().prevAll();
                var $descendantElementNext = $descendantElement().nextAll();

                parentView.createChildView(childView).andReplace(".descendant");

                expect($descendantElement()).not.toExist();
                expect(childView.$el.nextAll()).toBe($descendantElementNext);
                expect(childView.$el.prevAll()).toBe($descendantElementPrev);
            });

            it("appends a child view to a descendant element", function() {
                $descendantElement().append("<div class='some_element' />");
                parentView.createChildView(childView).andAppendItTo(".descendant");
                expect($descendantElement().children().last()).toBe(childView.$el);
            });

            it("prepends a descendant element with a child view", function() {
                $descendantElement().append("<div class='some_element' />");
                parentView.createChildView(childView).andPrependItTo(".descendant");
                expect($descendantElement().children().first()).toBe(childView.$el);
            });

        });

    });

    function $descendantElement() {
        return parentView.$(".descendant");
    }

    function $lastElement() {
        return parentView.$(".last");
    }

    function placeChildView() {
        parentView.createChildView(childView).andPlace(".descendant", "html");
    }

    function expectParentUnrenderedChildCountToBe(howmany) {
        expect(parentView.unrenderedChildViewCount()).toBe(howmany);
    }

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
