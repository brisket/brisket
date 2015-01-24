"use strict";

describe("validateView", function() {
    var validateView = require("lib/util/validateView");
    var Backbone = require("lib/application/Backbone");
    var View = require("lib/viewing/View");
    var _ = require("lodash");

    it("does NOT throw when passed a Backbone.View", function() {
        function validatingABackboneView() {
            validateView(new Backbone.View());
        }

        expect(validatingABackboneView).not.toThrow();
    });

    it("does NOT throw when passed a Brisket.View", function() {
        function validatingABrisketView() {
            validateView(new View());
        }

        expect(validatingABrisketView).not.toThrow();
    });

    it("throws when passed anything else", function() {
        var anythingElse = [
            1,
            "a string",
            View,
            null,
            undefined
        ];

        _.each(anythingElse, function(anything) {
            expect(function() {
                validateView(anything);
            }).toThrow();
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
