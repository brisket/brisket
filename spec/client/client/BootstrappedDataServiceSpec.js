"use strict";

var BootstrappedDataService = require("lib/client/BootstrappedDataService");
var $ = require("lib/application/jquery");

describe("BootstrappedDataService", function() {

    var bootstrappedData;
    var bootstrappedDataService;
    var method;
    var model;
    var options;

    beforeEach(function() {
        method = "GET";
        model = {
            url: "/url"
        };
        options = {};
    });

    afterEach(function() {
        bootstrappedDataService.clearMockedData();
    });

    describe("#checkAlreadyHasData syncing middleware", function() {

        describe("when it has data", function() {

            beforeEach(function() {
                bootstrappedData = {
                    "/url": {
                        "some": "data"
                    }
                };
                bootstrappedDataService = new BootstrappedDataService(bootstrappedData);
            });

            it("mocks out the next ajax call which will happen when sync completes", function(done) {
                bootstrappedDataService.checkAlreadyHasData(method, model, options);

                ajaxRequestModelData().then(function(data) {
                    expect(data).toEqual({
                        "some": "data"
                    });

                    done();
                });
            });

            describe("when data is requested twice", function() {

                var fetchingTwice;

                it("does NOT mock the second request", function(done) {
                    bootstrappedDataService.checkAlreadyHasData(method, model, options);

                    fetchingTwice = ajaxRequestModelData()
                        .then(function() {
                            bootstrappedDataService.checkAlreadyHasData(method, model, options);

                            return ajaxRequestModelData();
                        });

                    // using always because this is a jquery promise AND it fails on the second
                    //  call since an ajax call to /url in the tests won't succeed. this
                    //  expectation only cares that the mock data is NOT returned again so that's ok.
                    //  wawjr3d 10/17/2014
                    fetchingTwice.always(function(data) {
                        expect(data).not.toEqual({
                            "some": "data"
                        });

                        done();
                    });
                });

            });

        });

        describe("when it does NOT have data", function() {

            beforeEach(function() {
                bootstrappedDataService = new BootstrappedDataService();
            });

            it("does NOT mock ajax request", function(done) {
                bootstrappedDataService.checkAlreadyHasData(method, model, options);

                ajaxRequestModelData().always(function(data) {
                    expect(data).not.toEqual({
                        "some": "data"
                    });

                    done();
                });

            });

        });

    });

    function ajaxRequestModelData() {
        return $.ajax({
            url: "/url",
            dataType: "json"
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
