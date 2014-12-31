"use strict";

describe("Errors", function() {
    var Errors = require("lib/errors/Errors");

    var eventHandler;
    var error;

    beforeEach(function() {
        spyOn(console, "error");

        eventHandler = jasmine.createSpy("event-handler");
        Errors.onError(eventHandler);
    });

    describe("when error is a string", function() {

        beforeEach(function() {
            Errors.notify("there was an error");
        });

        it("console.errors a string", function() {
            expect(console.error).toHaveBeenCalledWith("there was an error");
        });

        it("calls event handler with string", function() {
            expect(eventHandler).toHaveBeenCalledWith("there was an error");
        });

    });

    describe("when error is a plain object", function() {

        beforeEach(function() {
            Errors.notify({
                some: "object"
            });
        });

        it("console.errors objects", function() {
            expect(console.error.calls.mostRecent().args[0]).toEqual({
                some: "object"
            });
        });

        it("calls event handler with object", function() {
            expect(eventHandler).toHaveBeenCalledWith({
                some: "object"
            });
        });

    });

    describe("when error is an Error object", function() {

        describe("when Error object has stack property (i.e. Node, modern browser)", function() {

            beforeEach(function() {
                error = errorWithStack();
                Errors.notify(error);
            });

            it("console.errors the error's stack trace", function() {
                expect(console.error).toHaveBeenCalledWith(error.stack);
            });

            it("calls event handler with error", function() {
                expect(eventHandler).toHaveBeenCalledWith(error);
            });

        });

        describe("when Error object does NOT have stack property (i.e. old browsers)", function() {

            beforeEach(function() {
                error = errorWithoutStack();
                Errors.notify(error);
            });

            it("console.errors the error", function() {
                expect(console.error).toHaveBeenCalledWith(error);
            });

            it("calls event handler with error", function() {
                expect(eventHandler).toHaveBeenCalledWith(error);
            });

        });

    });

    function errorWithStack() {
        var error = new Error();
        error.stack = error.stack || {}; // in case test runner is in old browser

        return error;
    }

    function errorWithoutStack() {
        var error = new Error();
        delete error.stack;

        return error;
    }

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
