"use strict";

var CloseableView = require("lib/traits/CloseableView");
var HasChildViews = require("lib/traits/HasChildViews");
var Backbone = require("lib/application/Backbone");
var Errors = require("lib/errors/Errors");
var _ = require("lodash");

describe("CloseableView", function() {

    var ViewThatCloses;
    var view;

    describe("#close", function() {

        beforeEach(function() {
            ViewThatCloses = Backbone.View.extend(_.extend({}, CloseableView));
            view = new ViewThatCloses();

            spyOn(view, "onClose");
            spyOn(view, "trigger");
            spyOn(view, "remove");
            spyOn(view, "unbind");

            view.close();
        });

        it("removes the view from the DOM", function() {
            expect(view.remove).toHaveBeenCalled();
        });

        it("unbinds all events that were listening to the view", function() {
            expect(view.unbind).toHaveBeenCalled();
        });

        it("alerts listeners that close is happening", function() {
            expect(view.trigger).toHaveBeenCalledWith("close");
        });

        it("calls view's onClose handler", function() {
            expect(view.onClose).toHaveBeenCalled();
        });

        describe("when the view does NOT extend HasChildViews", function() {

            beforeEach(function() {
                view = new ViewThatCloses();
            });

            it("does NOT have the method hasChildViews", function() {
                expect(view.hasChildViews).not.toBeDefined();
            });

        });

        describe("when the view extends HasChildViews", function() {

            beforeEach(function() {
                var ParentView = ViewThatCloses.extend(HasChildViews);
                view = new ParentView();
                spyOn(view, "closeChildViews").and.callThrough();
            });

            describe("when the view has child views", function() {

                beforeEach(function() {
                    view.createChildView(ViewThatCloses);
                });

                it("ensures that all child views will be closed", function() {
                    view.close();

                    expect(view.closeChildViews).toHaveBeenCalled();
                });

                describe("when closeChildViews was called explicitly", function() {

                    beforeEach(function() {
                        view.closeChildViews();
                    });

                    it("avoids calling closeChildViews again", function() {
                        view.close();

                        expect(view.closeChildViews.calls.count()).toBe(1);
                    });

                });

            });

            describe("when the view does NOT have any child view", function() {

                beforeEach(function() {
                    view.close();
                });

                it("does NOT call closeChildViews", function() {
                    expect(view.closeChildViews).not.toHaveBeenCalled();
                });

            });

        });

        describe("when there is an error in onClose", function() {

            var error;

            beforeEach(function() {
                error = new Error();
                view.onClose.and.callFake(function() {
                    throw error;
                });

                spyOn(Errors, "notify");

                view.close();
            });

            it("still removes the view from the DOM", function() {
                expect(view.remove).toHaveBeenCalled();
            });

            it("still unbinds all events that were listening to the view", function() {
                expect(view.unbind).toHaveBeenCalled();
            });

            it("reports the error to the console", function() {
                expect(Errors.notify).toHaveBeenCalledWith(error);
            });

        });

    });

    describe("#closeAsChild", function() {

        beforeEach(function() {
            ViewThatCloses = Backbone.View.extend(_.extend({}, CloseableView));
            view = new ViewThatCloses();

            spyOn(view, "onClose");
            spyOn(view, "trigger");
            spyOn(view, "remove");
            spyOn(view, "unbind");
            spyOn(view, "stopListening");
            spyOn(view.$el, "off");
            spyOn(view.$el, "removeData");

            view.closeAsChild();
        });

        it("does NOT remove the view from the DOM", function() {
            expect(view.remove).not.toHaveBeenCalled();
        });

        it("unbinds all events that were listening to the view", function() {
            expect(view.unbind).toHaveBeenCalled();
        });

        it("alerts listeners that close is happening", function() {
            expect(view.trigger).toHaveBeenCalledWith("close");
        });

        it("calls view's onClose handler", function() {
            expect(view.onClose).toHaveBeenCalled();
        });

        it("stops listening to new events", function() {
            expect(view.stopListening).toHaveBeenCalled();
        });

        it("unbinds all the view's $el's events", function() {
            expect(view.$el.off).toHaveBeenCalled();
        });

        it("removes all jquery data associated with view's el", function() {
            expect(view.$el.removeData).toHaveBeenCalled();
        });

        describe("when there is an error in onClose", function() {

            var error;

            beforeEach(function() {
                error = new Error();
                view.onClose.and.callFake(function() {
                    throw error;
                });

                spyOn(Errors, "notify");

                view.closeAsChild();
            });

            it("does NOT remove the view from the DOM", function() {
                expect(view.remove).not.toHaveBeenCalled();
            });

            it("still unbinds all events that were listening to the view", function() {
                expect(view.unbind).toHaveBeenCalled();
            });

            it("reports the error to the console", function() {
                expect(Errors.notify).toHaveBeenCalledWith(error);
            });

            it("stops listening to new events", function() {
                expect(view.stopListening).toHaveBeenCalled();
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
