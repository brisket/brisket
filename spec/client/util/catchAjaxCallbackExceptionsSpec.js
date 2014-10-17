"use strict";

var catchAjaxCallbackExceptions = require("lib/util/catchAjaxCallbackExceptions");

describe("catchAjaxCallbackExceptions", function() {

    var options;

    describe("when success, error, complete provided", function() {

        beforeEach(function() {
            options = {
                success: noop,
                error: noop,
                complete: noop
            };

            catchAjaxCallbackExceptions(null, null, options, noop);
        });

        it("wraps each in a promise", function() {
            expect(options.success().isFulfilled()).toBe(true);
            expect(options.error().isFulfilled()).toBe(true);
            expect(options.complete().isFulfilled()).toBe(true);
        });

    });

    describe("when complete is NOT provided", function() {

        beforeEach(function() {
            options = {
                success: noop,
                error: noop
            };

            catchAjaxCallbackExceptions(null, null, options, noop);
        });

        it("wraps success and error in a promise", function() {
            expect(options.success().isFulfilled()).toBe(true);
            expect(options.error().isFulfilled()).toBe(true);
        });

        it("does nothing to complete", function() {
            expect(options.complete).toBeUndefined();
        });

    });

    describe("when success throws exception", function() {

        beforeEach(function() {
            options = {
                success: callbackThatThrows
            };

            catchAjaxCallbackExceptions(null, null, options, noop);
        });

        it("wraps success in rejected promise", function() {
            expect(options.success().isResolved()).toBe(true);
        });

    });

    function noop() {}

    function callbackThatThrows() {
        throw new Error("Expected error for testing catchAjaxCallbackExceptions");
    }

    function itWrapsCallbackInAPromise(callback) {
        it("wraps " + callback + " in a promise", function(done) {
            var promise = options[callback]();

            promise.then(function() {
                expect(promise.isFulfilled()).toBe(true);
                done();
            });
        });
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
