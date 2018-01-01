"use strict";

describe("View", function() {
    var View = require("../../../lib/viewing/View");
    var Backbone = require("../../../lib/application/Backbone");
    var noop = require("../../../lib/util/noop");

    it("overwrites delegateEvents", function() {
        expect(View.prototype.delegateEvents).not.toBe(Backbone.View.prototype.delegateEvents);
    });

    it("overwrites undelegateEvents", function() {
        expect(View.prototype.undelegateEvents).not.toBe(Backbone.View.prototype.undelegateEvents);
    });

    describe("Backbone events", function() {
        var ExampleView;
        var view;

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
