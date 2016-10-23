"use strict";

describe("ErrorPage", function() {
    var ErrorPage = require("../../../lib/errors/ErrorPage");
    var Backbone = require("../../../lib/application/Backbone");

    var errorViewMapping;
    var PageNotFoundView;
    var ErrorView;

    describe("[deprecated] #create", function() {

        it("creates instances of errorViewMapping", function() {
            errorViewMapping = ErrorPage.create({
                500: Backbone.View
            });

            expect(errorViewMapping).toEqual({
                500: Backbone.View
            });
        });

    });

    describe("#viewFor", function() {

        beforeEach(function() {
            createValidErrorViewMapping();
        });

        it("returns null when errorViewMapping is empty", function() {
            expect(ErrorPage.viewFor(null, 500)).toBe(null);
        });

        describe("when statusCode is in mapping", function() {

            it("returns the View mapping to the statusCode", function() {
                expect(ErrorPage.viewFor(errorViewMapping, 404)).toBe(PageNotFoundView);
            });

        });

        describe("when statusCode is NOT in mapping", function() {

            it("returns the View mapping to a 500 statusCode", function() {
                expect(ErrorPage.viewFor(errorViewMapping, 234)).toBe(ErrorView);
            });

        });

    });

    describe("#getStatus", function() {

        beforeEach(function() {
            createValidErrorViewMapping();
        });

        it("returns 500 when errorViewMapping is empty", function() {
            expect(ErrorPage.getStatus(null, 500)).toBe(500);
        });

        describe("when statusCode is in mapping", function() {

            it("returns the statusCode", function() {
                expect(ErrorPage.getStatus(errorViewMapping, 404)).toBe(404);
            });

        });

        describe("when statusCode is NOT in mapping", function() {

            it("returns 500", function() {
                expect(ErrorPage.getStatus(errorViewMapping, 234)).toBe(500);
            });

        });

    });

    function createValidErrorViewMapping() {
        PageNotFoundView = Backbone.View.extend({
            name: "page_not_found"
        });
        ErrorView = Backbone.View.extend({
            name: "unhandled_error"
        });

        errorViewMapping = {
            404: PageNotFoundView,
            500: ErrorView
        };
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
