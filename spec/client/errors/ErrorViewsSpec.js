"use strict";

var ErrorViews = require("lib/errors/ErrorViews");
var Backbone = require("lib/application/Backbone");

describe("ErrorViews", function() {

    var errorViews;
    var PageNotFoundView;
    var ErrorView;

    it("requires that a 500 error be specified", function() {
        var creatingWithoutA500View = function() {
            new ErrorViews({
                404: Backbone.View
            });
        };

        expect(creatingWithoutA500View).toThrow();
    });

    describe("#viewFor", function() {

        beforeEach(function() {
            createValidErrorViews();
        });

        describe("when statusCode is in mapping", function() {

            it("returns the View mapping to the statusCode", function() {
                expect(errorViews.viewFor(404)).toBe(PageNotFoundView);
            });

        });

        describe("when statusCode is NOT in mapping", function() {

            it("returns the View mapping to a 500 statusCode", function() {
                expect(errorViews.viewFor(234)).toBe(ErrorView);
            });

        });

    });

    describe("#getStatus", function() {

        beforeEach(function() {
            createValidErrorViews();
        });

        describe("when statusCode is in mapping", function() {

            it("returns the statusCode", function() {
                expect(errorViews.getStatus(404)).toBe(404);
            });

        });

        describe("when statusCode is NOT in mapping", function() {

            it("returns 500", function() {
                expect(errorViews.getStatus(234)).toBe(500);
            });

        });

    });

    function createValidErrorViews() {
        PageNotFoundView = Backbone.View.extend({
            name: "page_not_found"
        });
        ErrorView = Backbone.View.extend({
            name: "unhandled_error"
        });

        errorViews = new ErrorViews({
            404: PageNotFoundView,
            500: ErrorView
        });
    }

});

// ----------------------------------------------------------------------------
// Copyright (C) 2016 Bloomberg Finance L.P.
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
