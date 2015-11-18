"use strict";

describe("Router", function() {
    var Errors = require("lib/errors/Errors");
    var Router = require("lib/controlling/Router");
    var noop = require("lib/util/noop");

    var router;
    var error;

    beforeEach(function() {
        router = new Router();
    });

    it("has a noop onClose by default", function() {
        expect(router.onClose).toBe(noop);
    });

    it("has a noop onRouteStart by default", function() {
        expect(router.onRouteStart).toBe(noop);
    });

    it("has a noop onRouteComplete by default", function() {
        expect(router.onRouteComplete).toBe(noop);
    });

    describe("#close", function() {

        beforeEach(function() {
            spyOn(router, "onClose");

            router.close();
        });

        it("calls router's onClose handler", function() {
            expect(router.onClose).toHaveBeenCalled();
        });

        describe("when there is an error in onClose", function() {

            beforeEach(function() {
                error = new Error();
                router.onClose.and.callFake(function() {
                    throw error;
                });

                spyOn(Errors, "notify");

                router.close();
            });

            it("reports the error to the console", function() {
                expect(Errors.notify).toHaveBeenCalledWith(error);
            });

        });

    });

    describe("#renderError", function() {

        it("returns a rejected promise with specified status code", function(done) {
            router.renderError(413).then(null, function(data) {
                expect(data.status).toBe(413);
                done();
            });
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
