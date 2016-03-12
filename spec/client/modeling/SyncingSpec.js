"use strict";

describe("Syncing", function() {
    var Syncing = require("lib/modeling/Syncing");
    var Backbone = require("backbone");
    var Promise = require("bluebird");

    var error;
    var data;
    var sync;

    beforeEach(function() {
        data = {};

        Syncing.clearMiddlewares();
        spyOn(Backbone, "sync").and.returnValue(Promise.resolve(data));
        error = new Error();
    });

    afterEach(function() {
        Syncing.clearMiddlewares();
    });

    describe("#sync", function() {

        describe("when a middleware rejects given deferred", function() {

            beforeEach(function() {
                Syncing.beforeSync(forceRejectSyncMiddleware);
            });

            it("returns a rejected promise", function(done) {
                sync = Syncing.sync();

                sync.lastly(function() {
                    expect(sync.isRejected()).toBe(true);
                    expect(sync.reason()).toBe(error);
                    done();
                });
            });

        });

        describe("when no middleware rejects given deferred", function() {

            beforeEach(function() {
                Syncing.beforeSync(doNotRejectSyncMiddleware);
            });

            it("returns a fulfilled promise", function(done) {
                sync = Syncing.sync();

                sync.lastly(function() {
                    expect(sync.isFulfilled()).toBe(true);
                    expect(sync.value()).toBe(data);
                    done();
                });
            });

        });

    });

    function forceRejectSyncMiddleware(method, model, options, renderError) {
        renderError(error);
    }

    function doNotRejectSyncMiddleware() {}

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
