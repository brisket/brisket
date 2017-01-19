"use strict";

describe("View", function() {
    var View = require("../../../lib/viewing/View");
    var Backbone = require("../../../lib/application/Backbone");

    var view;

    it("is an extension of Backbone.View", function() {
        expect(View.prototype instanceof Backbone.View).toBe(true);
    });

    it("exposes delegateEvents from Backbone.View", function() {
        expect(View.prototype.delegateEvents).toBe(Backbone.View.prototype.delegateEvents);
    });

    it("exposes undelegateEvents from Backbone.View", function() {
        expect(View.prototype.undelegateEvents).toBe(Backbone.View.prototype.undelegateEvents);
    });

    describe("when it closes, then enterDOM is called again", function() {

        beforeEach(function() {
            view = new View();

            spyOn(view, "onDOM");

            view.enterDOM();
            view.close();
            view.enterDOM();
        });

        it("invokes onDOM twice", function() {
            expect(view.onDOM.calls.count()).toBe(2);
        });

    });

});

// ----------------------------------------------------------------------------
// Copyright (C) 2017 Bloomberg Finance L.P.
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
