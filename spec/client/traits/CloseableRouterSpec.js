"use strict";

var CloseableRouter = require("lib/traits/CloseableRouter");
var Backbone = require("lib/application/Backbone");
var Errors = require("lib/errors/Errors");
var _ = require("underscore");

describe("CloseableRouter", function() {

    var RouterThatCloses;
    var router;

    describe("#close", function() {

        beforeEach(function() {
            RouterThatCloses = Backbone.Router.extend(_.extend({}, CloseableRouter));
            router = new RouterThatCloses();

            spyOn(router, "onClose");

            router.close();
        });

        it("calls router's onClose handler", function() {
            expect(router.onClose).toHaveBeenCalled();
        });

        describe("when there is an error in onClose", function() {

            var error;

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
