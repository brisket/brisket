"use strict";

var View = require("lib/viewing/View");
var Backbone = require("lib/application/Backbone");

describe("View", function() {

    var ParentView;
    var parentView;

    it("is an extension of Backbone.View", function() {
        expect(View.prototype instanceof Backbone.View).toBe(true);
    });

    describe("when view has child views", function() {

        beforeEach(function() {
            ParentView = View.extend({
                template: "some/template",
                render: jasmine.createSpy()
            });

            parentView = new ParentView();
            parentView.createChildView(View);
        });

        it("forces you to implement an onClose", function() {
            expect(closeParentViewWithoutOnClose).toThrow();

            parentView.onClose = function() {
                this.closeChildViews();
            };

            expect(closeParentViewWithoutOnClose).not.toThrow();
        });

    });

    describe("when view does NOT have child views", function() {

        beforeEach(function() {
            ParentView = View.extend({
                template: "some/template",
                render: jasmine.createSpy()
            });

            parentView = new ParentView();
        });

        it("does NOT force you to implement an onClose", function() {
            expect(closeParentViewWithoutOnClose).not.toThrow();
        });
    });

    function closeParentViewWithoutOnClose() {
        parentView.onClose();
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
