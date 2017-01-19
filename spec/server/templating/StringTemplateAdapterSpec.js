"use strict";

describe("StringTemplateAdapter", function() {
    var StringTemplateAdapter = require("../../../lib/templating/StringTemplateAdapter");
    var View = require("../../../lib/viewing/View");
    var Model = require("backbone").Model;

    var view;
    var ExampleView;
    var model;

    it("renders template string directly", function() {
        var SOME_LOCAL_CONSTANT = "slc";

        ExampleView = View.extend({

            templateAdapter: StringTemplateAdapter,

            template: "<span class='test'>" + SOME_LOCAL_CONSTANT + "</span>"

        });

        view = new ExampleView();

        view.render();

        expect(view.el.innerHTML).toBe('<span class="test">slc</span>');
    });

    it("renders template string function as a string", function() {
        ExampleView = View.extend({

            templateAdapter: StringTemplateAdapter,

            template: function() {
                return "<span class='test'>I should be rendered</span>";
            }

        });

        view = new ExampleView();

        view.render();

        expect(view.el.innerHTML)
            .toBe('<span class="test">I should be rendered</span>');
    });

    it("passes view data to template string function as a string", function() {
        ExampleView = View.extend({

            templateAdapter: StringTemplateAdapter,

            logic: function() {
                return {
                    "logicKey": "logic-value"
                };
            },

            template: function(data) {
                var modelKey = data.modelKey;
                var logicKey = data.logicKey;

                return "<span class='test'>model: " + modelKey +
                    ", logic: " + logicKey + "</span>";
            }

        });

        model = new Model();
        model.set("modelKey", "model-value");

        view = new ExampleView({
            model: model
        });

        view.render();

        expect(view.el.innerHTML)
            .toBe('<span class="test">model: model-value, logic: logic-value</span>');
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
