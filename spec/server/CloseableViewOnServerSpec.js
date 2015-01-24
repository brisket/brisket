"use strict";

var CloseableView = require("../../lib/traits/CloseableView");
var Backbone = require("../../lib/application/Backbone");
var Environment = require("../../lib/environment/Environment");
var $ = require("../../lib/application/jquery");
var _ = require("lodash");

describe("closing CloseableView on server", function() {
    var ViewThatCloses;
    var view;

    describe("#closeAsChild", function() {

        beforeEach(function() {
            Backbone.$ = $;

            spyOn(Environment, "isServer").and.returnValue(true);

            ViewThatCloses = Backbone.View.extend(_.extend({}, CloseableView));
            view = new ViewThatCloses();

            spyOn(view, "onClose");
            spyOn(view, "trigger");
            spyOn(view, "remove");
            spyOn(view, "unbind");

            view.closeAsChild();
        });

        it("removes the view from the DOM", function() {
            expect(view.remove).toHaveBeenCalled();
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
