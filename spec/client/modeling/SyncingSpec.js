"use strict";

var Syncing = require("lib/modeling/Syncing");
var Backbone = require("backbone");
var Promise = require("bluebird");

describe("Syncing", function() {

    beforeEach(function() {
        Syncing.clearMiddlewares();
        spyOn(Backbone, "sync").andReturn(Promise.resolve());
    });

    afterEach(function() {
        Syncing.clearMiddlewares();
    });

    describe("#sync", function() {

        describe("when a middleware rejects given deferred", function() {

            beforeEach(function() {
                Syncing.beforeSync(forceRejectSyncMiddleware);
            });

            it("returns a rejected promise", function() {
                expect(Syncing.sync().isRejected()).toBe(true);
            });

        });

        describe("when no middleware rejects given deferred", function() {

            beforeEach(function() {
                Syncing.beforeSync(doNotRejectSyncMiddleware);
            });

            it("returns a fulfilled promise", function() {
                expect(Syncing.sync().isFulfilled()).toBe(true);
            });

        });

    });

    function forceRejectSyncMiddleware(method, model, options, renderError) {
        renderError("Expecting this rejection for sync test");
    }

    function doNotRejectSyncMiddleware() {}

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
