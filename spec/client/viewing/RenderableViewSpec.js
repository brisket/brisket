"use strict";

describe("RenderableView", function() {
    var RenderableView = require("lib/viewing/RenderableView");
    var Backbone = require("lib/application/Backbone");
    var TemplateAdapter = require("lib/templating/TemplateAdapter");

    var model;
    var BaseRenderableView;
    var ChildViewsInTemplate;
    var ViewThatRenders;
    var view;
    var childView;

    beforeEach(function() {
        model = new Backbone.Model({
            "from_model": "model data"
        });
        BaseRenderableView = Backbone.View.extend(RenderableView);
    });

    describe("when gathering data for template rendering", function() {

        describe("when view has additional logic", function() {

            beforeEach(function() {
                ViewThatRenders = BaseRenderableView.extend(WithLogic);
                view = new ViewThatRenders({
                    model: model
                });
            });

            it("combines the data in the model and returned from logic", function() {
                expect(view.templateData()).toEqual(jasmine.objectContaining({
                    "from_model": "model data",
                    "from_logic": "logic data"
                }));
            });

        });

        describe("when modelForView is present", function() {

            beforeEach(function() {
                ViewThatRenders = BaseRenderableView.extend(WithModelForView);
                view = new ViewThatRenders({
                    model: model
                });
            });

            it("exposes the data from the view model", function() {
                expect(view.templateData()).toEqual(jasmine.objectContaining({
                    "from_view_model": "view model data"
                }));
            });

        });

        describe("when modelForView is NOT present", function() {

            beforeEach(function() {
                ViewThatRenders = BaseRenderableView.extend();
                view = new ViewThatRenders({
                    model: model
                });
            });

            it("exposes the data from the model", function() {
                expect(view.templateData()).toEqual(jasmine.objectContaining({
                    "from_model": "model data"
                }));
            });

        });

        describe("when child View has child views", function() {

            it("exposes child views that have not been placed in View through template data", function() {
                ViewThatRenders = BaseRenderableView.extend({

                    template: expectTemplateHasViews,

                    beforeRender: function() {
                        this.createChildView("identifier", BaseRenderableView);

                        this.createChildView("identifier2", BaseRenderableView);

                        this.createChildView("identifier3", BaseRenderableView)
                            .andAppendIt();
                    }
                });

                view = new ViewThatRenders({
                    model: model
                });

                view.render();

                function expectTemplateHasViews(data) {
                    var views = data.views;

                    expect(views["identifier"]).toBeDefined();
                    expect(views["identifier2"]).toBeDefined();
                    expect(views["identifier3"]).toBeUndefined();
                }
            });

        });

    });

    describe("when rendering", function() {
        var childView1;
        var childView2;
        var childView3;

        describe("when it has child views placed directly in template", function() {

            beforeEach(function() {
                childView1 = new Backbone.View();
                childView2 = new Backbone.View();
                childView3 = new Backbone.View();

                ChildViewsInTemplate = BaseRenderableView.extend({
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

            it("renders child views placed directly in template", function() {
                expect(view.$(childView1.el)).toExist();
                expect(view.$(childView2.el)).toExist();
                expect(view.$(childView3.el)).toExist();
            });

            it("renders child views exactly where they had been placed in template", function() {
                expect(view.$(".first").next().get(0)).toBe(childView1.el);
                expect(view.$(".third").next().get(0)).toBe(childView2.el);
                expect(view.$(".fifth").next().get(0)).toBe(childView3.el);
            });

        });

        describe("when it has unrendered child views", function() {

            beforeEach(function() {
                view = new BaseRenderableView();
                view.el.innerHTML = "<div class='first'></div>" +
                    "<div class='descendant'></div>" +
                    "<div class='last'></div>";

                childView1 = new Backbone.View();
                childView2 = new Backbone.View();
                childView3 = new Backbone.View();

                view.createChildView(childView1).andAppendIt();
                view.createChildView(childView2).andInsertInto(".descendant");
                view.createChildView(childView3).andPrependItTo(".first");

                expect(view.unrenderedChildViews.length).toBe(3);
                expect(view.$(childView1.el)).not.toExist();
                expect(view.$(childView2.el)).not.toExist();
                expect(view.$(childView3.el)).not.toExist();

                view.render();
            });

            it("renders any unrendered child views", function() {
                expect(view.$(childView1.el)).toExist();
                expect(view.$(childView2.el)).toExist();
                expect(view.$(childView3.el)).toExist();
            });

            it("renders any unrendered child views in expected positions", function() {
                expect(view.$(".last").next()).$toBe(childView1.$el);
                expect(view.$(".descendant").children()).$toBe(childView2.$el);
                expect(view.$(".first").children().first()).$toBe(childView3.$el);
            });

        });

        describe("when instantiating child views", function() {

            beforeEach(function() {
                view = new BaseRenderableView();
                childView1 = new BaseRenderableView();
            });

            describe("when child view already has a uid", function() {

                beforeEach(function() {
                    view.setUid("0");
                    childView1.setUid("a valid uid");
                    view.createChildView(childView1).instantiateChildView();
                });

                it("does NOT change the child view's uid", function() {
                    expect(childView1.uid).toBe("a valid uid");
                });

            });

            describe("when child view does NOT have a uid", function() {

                beforeEach(function() {
                    view.setUid("0");
                    childView1.setUid(null);
                    view.createChildView(childView1).instantiateChildView();
                });

                it("sets the child view's uid", function() {
                    expect(childView1.uid).toBe("0_1");
                });

            });

            describe("when number of child views goes down and then back up", function() {
                var uids;

                beforeEach(function() {
                    uids = [];
                    childView2 = new BaseRenderableView();
                    childView3 = new BaseRenderableView();
                });

                it("sets the child view to a unique uid", function() {
                    view.createChildView("childview1", childView1).instantiateChildView();
                    uids.push(childView1.uid);
                    view.createChildView("childview2", childView2).instantiateChildView();
                    uids.push(childView2.uid);

                    view.closeChildView("childview2");

                    view.createChildView("childview3", childView3).instantiateChildView();

                    expect(uids).not.toContain(childView3);
                });

            });

        });

        describe("when view has decorators", function() {
            var firstDecorateFunction;
            var secondDecorateFunction;

            beforeEach(function() {
                firstDecorateFunction = jasmine.createSpy();
                secondDecorateFunction = jasmine.createSpy();

                ViewThatRenders = BaseRenderableView.extend({
                    decorators: [{
                        decorate: firstDecorateFunction
                    }, {
                        decorate: secondDecorateFunction
                    }]
                });

                view = new ViewThatRenders();

                spyOn(view, "runDecorators").and.callThrough();
            });

            it("runs decorators", function() {
                view.render();
                expect(view.runDecorators).toHaveBeenCalled();
            });

            it("calls decorate on each decorator", function() {
                view.render();
                expect(firstDecorateFunction).toHaveBeenCalled();
                expect(secondDecorateFunction).toHaveBeenCalled();
            });

            it("calls decorate functions with the view's $el", function() {
                view.render();
                expect(firstDecorateFunction).toHaveBeenCalledWith(view.$el);
                expect(secondDecorateFunction).toHaveBeenCalledWith(view.$el);
            });

            it("runs decorators after afterRender", function() {
                spyOn(view, "afterRender").and.callFake(function() {
                    expect(firstDecorateFunction).not.toHaveBeenCalled();
                    expect(secondDecorateFunction).not.toHaveBeenCalled();
                });
                view.render();
                expect(firstDecorateFunction).toHaveBeenCalled();
                expect(secondDecorateFunction).toHaveBeenCalled();
            });
        });

        describe("when view does NOT have decorators", function() {

            beforeEach(function() {
                view = new BaseRenderableView();
                spyOn(view, "runDecorators").and.callThrough();
            });

            it("runs decorators", function() {
                view.render();
                expect(view.runDecorators).toHaveBeenCalled();
            });

            it("does NOT throw", function() {
                var renderingWithoutDecorators = function() {
                    view.render();
                };

                expect(renderingWithoutDecorators).not.toThrow();
            });

        });

        describe("when has already been attached", function() {

            beforeEach(function() {
                view = new BaseRenderableView();
                view.isAttached = true;
            });

            it("does not render it's template", function() {
                spyOn(view, "renderTemplate");

                view.render();

                expect(view.renderTemplate).not.toHaveBeenCalled();
            });

            describe("when it has unrendered child views", function() {

                beforeEach(function() {
                    childView1 = new BaseRenderableView();
                    view.createChildView(childView1).andAppendIt();
                });

                it("reattaches child views", function() {
                    spyOn(childView1, "reattach");

                    view.render();

                    expect(childView1.reattach).toHaveBeenCalled();
                });

                it("calls child view's render to recursively reattach view", function() {
                    spyOn(childView1, "render");

                    view.render();

                    expect(childView1.render).toHaveBeenCalled();
                });
            });

        });

        describe("#render", function() {

            it("returns view", function() {
                expect(view.render()).toBe(view);
            });

        });

    });

    describe("when entering the DOM", function() {
        var childViewInTemplate;
        var childViewWithIdentifier;

        beforeEach(function() {
            childView = new BaseRenderableView();
            childViewWithIdentifier = new BaseRenderableView();
            childViewInTemplate = new BaseRenderableView();

            spyOn(childView, "enterDOM");
            spyOn(childViewWithIdentifier, "enterDOM");
            spyOn(childViewInTemplate, "enterDOM");

            ViewThatRenders = BaseRenderableView.extend({
                template: function(data) {
                    var views = data.views;

                    return views.childViewInTemplate;
                },

                beforeRender: function() {
                    this.createChildView("childViewInTemplate", childViewInTemplate);

                    this.createChildView(childView)
                        .andAppendIt();

                    this.createChildView("identifier", childViewWithIdentifier)
                        .andAppendIt();
                }

            });

            view = new ViewThatRenders({
                model: model
            });

            view.render();
        });

        it("calls onDOM callback", function() {
            spyOn(view, "onDOM");

            view.enterDOM();

            expect(view.onDOM).toHaveBeenCalled();
        });

        it("triggers 'on-dom' event", function() {
            spyOn(view, "trigger");

            view.enterDOM();

            expect(view.trigger).toHaveBeenCalledWith("on-dom");
        });

        it("alerts child views that they have entered the DOM", function() {
            view.enterDOM();

            expect(childView.enterDOM).toHaveBeenCalled();
            expect(childViewWithIdentifier.enterDOM).toHaveBeenCalled();
            expect(childViewInTemplate.enterDOM).toHaveBeenCalled();
        });

    });

    describe("#renderTemplate", function() {

        describe("when view has a valid template AND templateAdapter", function() {

            beforeEach(function() {
                ViewThatRenders = BaseRenderableView.extend({
                    template: "some template",
                    templateAdapter: TemplateAdapter.extend({
                        templateToHTML: jasmine.createSpy().and.returnValue("expected html")
                    })
                });
                view = new ViewThatRenders();
                view.renderTemplate();
            });

            it("sets view's el.innerHTML to be templateAdapter.templateToHTML", function() {
                expect(view.el.innerHTML).toBe("expected html");
            });

        });

        describe("when template has NOT been set", function() {

            beforeEach(function() {
                ViewThatRenders = BaseRenderableView.extend({
                    template: null,
                    templateAdapter: TemplateAdapter.extend({
                        templateToHTML: jasmine.createSpy().and.returnValue("expected html")
                    })
                });
                view = new ViewThatRenders();
                view.renderTemplate();
            });

            it("does NOT modify view's el.innerHTML", function() {
                expect(view.el.innerHTML).toBe("");
            });

        });

        describe("when templateAdapter has NOT been set", function() {

            beforeEach(function() {
                ViewThatRenders = BaseRenderableView.extend({
                    template: "some template",
                    templateAdapter: null
                });
                view = new ViewThatRenders();
            });

            it("throws an error", function() {
                var renderingTemplateWithoutTemplateAdapter = function() {
                    view.renderTemplate();
                };

                expect(renderingTemplateWithoutTemplateAdapter).toThrow();
            });

        });

        describe("when TemplateAdapter is not a prototype of templateAdapter", function() {

            var invalidTemplateAdapter;

            beforeEach(function() {
                invalidTemplateAdapter = {
                    templateToHTML: jasmine.createSpy()
                };

                ViewThatRenders = BaseRenderableView.extend({
                    template: "some template",
                    templateAdapter: invalidTemplateAdapter
                });

                view = new ViewThatRenders();
            });

            it("throws an error", function() {
                var renderingTemplateWithInvalidTemplateAdapter = function() {
                    view.renderTemplate();
                };

                expect(renderingTemplateWithInvalidTemplateAdapter).toThrow();
                expect(invalidTemplateAdapter.templateToHTML).not.toHaveBeenCalled();
            });

        });

    });

    describe("#enterDOM", function() {

        beforeEach(function() {
            view = new BaseRenderableView();
            spyOn(view, "onDOM");
        });

        describe("when it is called twice", function() {

            beforeEach(function() {
                view.enterDOM();
                view.enterDOM();
            });

            it("invokes onDOM once", function() {
                expect(view.onDOM.calls.count()).toBe(1);
            });

        });

        describe("when it is called once", function() {

            beforeEach(function() {
                view.enterDOM();
            });

            it("invokes onDOM once", function() {
                expect(view.onDOM.calls.count()).toBe(1);
            });

        });

        describe("when close event is triggered and enterDOM is called again", function() {

            beforeEach(function() {
                view.enterDOM();
                view.trigger("close");
                view.enterDOM();
            });

            it("invokes onDOM twice", function() {
                expect(view.onDOM.calls.count()).toBe(2);
            });

        });

    });

    var WithLogic = {
        logic: function() {
            return {
                "from_logic": "logic data"
            };
        }
    };

    var WithModelForView = {
        modelForView: function() {
            return {
                "from_view_model": "view model data"
            };
        }
    };

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
