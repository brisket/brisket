"use strict";

var calculateSyncRequestUrl = require("lib/util/calculateSyncRequestUrl");

describe("calculateSyncRequestUrl", function() {

    var options;
    var model;

    beforeEach(function() {
        model = {};
        options = {};
    });

    describe("parameters", function() {

        it("does NOT require model", function() {
            var callingWithoutModel = function() {
                calculateSyncRequestUrl(null, options);
            };

            expect(callingWithoutModel).not.toThrow();
        });

        it("does NOT require options", function() {
            var callingWithoutOptions = function() {
                calculateSyncRequestUrl(model, null);
            };

            expect(callingWithoutOptions).not.toThrow();
        });

    });

    describe("when options hash has a url", function() {

        beforeEach(function() {
            options = {
                url: "/optionsurl"
            };
        });

        it("returns options.url", function() {
            expect(calculateSyncRequestUrl(model, options)).toBe("/optionsurl");
        });

    });

    describe("when options hash does NOT have a url", function() {

        describe("when model url field is a string", function() {

            beforeEach(function() {
                model = {
                    url: "/modelurl"
                };
            });

            it("returns model.url", function() {
                expect(calculateSyncRequestUrl(model, options)).toBe("/modelurl");
            });

        });

        describe("when model url field is a function", function() {

            beforeEach(function() {
                model = {
                    url: function() {
                        return "/modelurl";
                    }
                };
            });

            it("returns model.url", function() {
                expect(calculateSyncRequestUrl(model, options)).toBe("/modelurl");
            });

        });

    });

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
