"use strict";

var HasChildViews = require("lib/traits/HasChildViews");
var _ = require("lodash");
var Backbone = require("lib/application/Backbone");

describe("HasChildViews", function() {

    var ParentView;
    var parentView;
    var ChildView;
    var childView;
    var viewRelationship;
    var anotherChildView;
    var childViewWithIdentifier;

    beforeEach(function() {
        ParentView = Backbone.View.extend(_.extend({}, HasChildViews, {
            template: "<div class='first'></div>" + "<div class='descendant'></div>" + "<div class='last'></div>"
        }));

        parentView = new ParentView();

        ChildView = Backbone.View.extend();
        childView = new ChildView();

        anotherChildView = new ChildView();
        childViewWithIdentifier = null;
        viewRelationship = null;

        expectParentChildCountToBe(0);
    });

    describe("when creating a child view", function() {

        it("it does NOT allow you to create a child view with a falsy child view", function() {
            function creatingChildViewWithFalsyChildView() {
                parentView.createChildView(null);
            }

            expect(creatingChildViewWithFalsyChildView).toThrow();
        });

        it("creates a child view from a View constructor", function() {
            createChildViewByConstructor();
            expectParentChildCountToBe(1);

            createChildViewByConstructor();
            expectParentChildCountToBe(2);
        });

        it("creates a child view from an instance of a View", function() {
            createInstantiatedChildView();
            expectParentChildCountToBe(1);

            createInstantiatedChildView();
            expectParentChildCountToBe(2);
        });

        it("creates a child view with an identifier", function() {
            parentView.createChildView("identifier", childView);
            createChildViewByConstructor();

            expectParentChildCountToBe(2);
            expect(parentView.childViews["identifier"].childView).toBe(childView);
        });

        it("does NOT allow 'number-like' identifiers", function() {
            var creatingChildViewWithNumberLikeIdentifier = function() {
                parentView.createChildView("123", childView);
            };

            expect(creatingChildViewWithNumberLikeIdentifier).toThrow();
        });

        describe("when creating a child view with an identifier already in use", function() {

            beforeEach(function() {
                parentView.createChildView("identifier", ChildView);
            });

            it("does NOT allow you to create the view with the used identifier", function() {
                var creatingChildViewWithUsedIdentifier = function() {
                    parentView.createChildView("identifier", ChildView);
                };

                expect(creatingChildViewWithUsedIdentifier).toThrow();
            });

        });

    });

    describe("when replacing a child view", function() {

        describe("when a child view with the same identifier already exists", function() {

            beforeEach(function() {
                viewRelationship = parentView.createChildView("identifier", childView);
            });

            it("closes the view that was there", function() {
                spyOn(viewRelationship, "close");
                parentView.replaceChildView("identifier", ChildView);

                expect(viewRelationship.close).toHaveBeenCalled();
            });

            it("replaces the old child view with the new one", function() {
                parentView.replaceChildView("identifier", anotherChildView);

                expectParentChildCountToBe(1);
                expect(parentView.childViews["identifier"].childView).toBe(anotherChildView);
            });

            it("removes existing child view from unrendered child views", function() {
                viewRelationship.andAppendIt();
                spyOn(parentView, "removeUnrenderedChildView").and.callThrough();

                parentView.replaceChildView("identifier", anotherChildView);

                expect(parentView.removeUnrenderedChildView).toHaveBeenCalledWith(viewRelationship);
            });

        });

        describe("when a child view with the same identifier does NOT exist", function() {

            it("creates a child view by identifier", function() {
                parentView.replaceChildView("identifier", anotherChildView);

                expectParentChildCountToBe(1);
                expect(parentView.childViews["identifier"].childView).toBe(anotherChildView);
            });

        });

    });

    describe("when closing child views", function() {

        describe("when view has child views", function() {

            beforeEach(function() {
                spyOn(childView, "remove");
                createInstantiatedChildView();
            });

            it("removes all child views", function() {
                parentView.closeChildViews();

                expectParentChildCountToBe(0);
                expectParentUnrenderedChildCountToBe(0);
            });

            it("cleans up the underlying view", function() {
                childView.closeAsChild = jasmine.createSpy();
                parentView.closeChildViews();

                expect(childView.closeAsChild).toHaveBeenCalled();
            });

            it("does NOT directly call remove on the child view", function() {
                expect(childView.remove).not.toHaveBeenCalled();
            });

        });

        describe("when closing by identifier", function() {

            var someOtherViewRelationship;
            var anotherViewRelationship;
            var identifierViewRelationship;

            it("closes a child view by an identifier", function() {
                parentView.createChildView("identifier", childView);
                expectParentChildCountToBe(1);

                parentView.closeChildView("identifier");

                expectParentChildCountToBe(0);
                expect(parentView.childViews).not.toHaveKey("identifier");
            });

            it("removes unrendered child view", function() {
                someOtherViewRelationship = parentView.createChildView(ChildView).andAppendIt();
                identifierViewRelationship = parentView.createChildView("identifier", childView).andAppendIt();
                anotherViewRelationship = parentView.createChildView(ChildView).andAppendIt();

                expectParentUnrenderedChildCountToBe(3);

                parentView.closeChildView("identifier");

                expectParentUnrenderedChildCountToBe(2);
                expect(parentView.unrenderedChildViews).toContain(someOtherViewRelationship);
                expect(parentView.unrenderedChildViews).not.toContain(identifierViewRelationship);
                expect(parentView.unrenderedChildViews).toContain(anotherViewRelationship);
            });

            describe("when childView does not exist by identifier", function() {

                beforeEach(function() {
                    placeChildView();
                });

                it("does not try to remove the child a view", function() {
                    spyOn(parentView, "removeUnrenderedChildView");
                    parentView.closeChildView("identifier");

                    expect(parentView.removeUnrenderedChildView).not.toHaveBeenCalled();
                });

                it("does not throw an error", function() {
                    var closingAChildViewThatDoesntExist = function() {
                        parentView.closeChildView("identifier");
                    };

                    expect(closingAChildViewThatDoesntExist).not.toThrow();
                });

            });

        });

        describe("when view has no child views", function() {

            it("code does not blow up", function() {
                var closingViewWithNoChildViews = function() {
                    parentView.closeChildViews();
                };

                expect(closingViewWithNoChildViews).not.toThrow();
            });

        });

    });

    describe("when passing options to child view", function() {

        var options;

        describe("when creating a child view from a View constructor", function() {

            beforeEach(function() {
                options = {
                    model: "fake model"
                };
                viewRelationship = parentView.createChildView(ChildView).withOptions(options);
                viewRelationship.instantiateChildView();
            });

            it("sets the options for the child view that will be instantiated", function() {
                expect(viewRelationship.childView.model).toBe("fake model");
            });

        });

        describe("when creating a child view from an instance of a View", function() {

            it("does not allow you to set options", function() {
                var creatingInstantiatedChildViewWithOptions = function() {
                    parentView.createChildView(childView).withOptions(options);
                };

                expect(creatingInstantiatedChildViewWithOptions).toThrow();
            });

        });

    });

    describe("#hasChildViews", function() {

        describe("when parent has child views", function() {

            it("is true", function() {
                createInstantiatedChildView();
                expect(parentView.hasChildViews()).toBe(true);
            });

        });

        describe("when parent does NOT have child views", function() {

            it("is false", function() {
                expect(parentView.hasChildViews()).toBe(false);
            });

        });

    });

    describe("#childViewCount", function() {

        describe("when parentView has view relationships by identifier", function() {

            beforeEach(function() {
                parentView.createChildView(childView);
                parentView.createChildView("identifier", anotherChildView);
            });

            it("returns total number of view relationships", function() {
                expect(parentView.childViewCount()).toBe(2);
            });

        });

    });

    describe("#foreachChildView", function() {
        var viewRelationshipWithIdentifier;

        beforeEach(function() {
            viewRelationship = parentView.createChildView(childView);
            viewRelationshipWithIdentifier = parentView.createChildView("identifier", anotherChildView);

            spyOn(viewRelationship, "enterDOM");
            spyOn(viewRelationshipWithIdentifier, "enterDOM");
        });

        it("iterates over all view relationships", function() {
            parentView.foreachChildView(function(viewRelationship) {
                viewRelationship.enterDOM();
            });

            expect(viewRelationship.enterDOM).toHaveBeenCalled();
            expect(viewRelationshipWithIdentifier.enterDOM).toHaveBeenCalled();
        });

    });

    function expectParentChildCountToBe(howmany) {
        expect(parentView.childViewCount()).toBe(howmany);
    }

    function expectParentUnrenderedChildCountToBe(howmany) {
        expect(parentView.unrenderedChildViewCount()).toBe(howmany);
    }

    function createChildViewByConstructor() {
        parentView.createChildView(ChildView);
    }

    function createInstantiatedChildView() {
        parentView.createChildView(childView);
    }

    function placeChildView() {
        parentView.createChildView(childView).andPlace(".descendant", "html");
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
