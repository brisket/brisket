"use strict";

var Syncing = require("lib/modeling/Syncing");
var Backbone = require("backbone");
var Promise = require("bluebird");

describe("Syncing", function() {

    var options;
    var forceReturnedData1;
    var forceReturnedData2;

    beforeEach(function() {
        Syncing.clearMiddlewares();
        spyOn(Backbone, "sync").andReturn(Promise.resolve());

        options = {
            success: jasmine.createSpy("successCallback")
        };
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

        describe("when a middleware force-returns data", function() {

            beforeEach(function() {
                forceReturnedData1 = {
                    data: 1
                };

                Syncing.beforeSync(forceReturnDataMiddleware1);
            });

            it("returns a promise of the force-returned data", function() {
                Syncing.sync().then(function(data) {
                    expect(data).toBe(forceReturnedData1);
                });
            });

            it("does NOT invoke Backbone.sync", function() {
                Syncing.sync().then(function() {
                    expect(Backbone.sync).not.toHaveBeenCalled();
                });
            });

            it("invokes success callback with force-returned data", function() {
                Syncing.sync(null, null, options).then(function() {
                    expect(options.success).toHaveBeenCalledWith(forceReturnedData1);
                });
            });

        });

        describe("when two middlewares force-return data", function() {

            beforeEach(function() {
                forceReturnedData1 = {
                    data: 1
                };

                forceReturnedData2 = {
                    data: 2
                };

                Syncing.beforeSync(forceReturnDataMiddleware1);
                Syncing.beforeSync(forceReturnDataMiddleware2);
            });

            it("returns promise of data from the second middleware", function() {
                Syncing.sync().then(function(data) {
                    expect(data).toBe(forceReturnedData2);
                });
            });

            it("does NOT invoke Backbone.sync", function() {
                Syncing.sync().then(function() {
                    expect(Backbone.sync).not.toHaveBeenCalled();
                });
            });

            it("invokes success callback with data from second middleware", function() {
                Syncing.sync(null, null, options).then(function() {
                    expect(options.success).toHaveBeenCalledWith(forceReturnedData2);
                });
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

    function forceRejectSyncMiddleware(method, model, options, returnData, renderError) {
        renderError("Expecting this rejection for sync test");
    }

    function forceReturnDataMiddleware1(method, model, options, returnData) {
        returnData(forceReturnedData1);
    }

    function forceReturnDataMiddleware2(method, model, options, returnData) {
        returnData(forceReturnedData2);
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
