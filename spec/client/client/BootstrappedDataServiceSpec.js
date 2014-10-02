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

            it("mocks out the next ajax call which will happen when sync completes", function() {
                bootstrappedDataService.checkAlreadyHasData(method, model, options);

                wait("for ajax call to complete").until(ajaxRequestModelData())
                    .then(function(data) {
                        expect(data).toEqual({
                            "some": "data"
                        });
                    });
            });

            describe("when data is requested twice", function() {

                var fetchingTwice;

                it("does NOT mock the second request", function() {
                    bootstrappedDataService.checkAlreadyHasData(method, model, options);

                    fetchingTwice = function() {
                        return ajaxRequestModelData()
                            .then(function() {
                                bootstrappedDataService.checkAlreadyHasData(method, model, options);

                                return ajaxRequestModelData();
                            });
                    };

                    wait("for ajax call to complete").until(fetchingTwice())
                        .then(function(data) {
                            expect(data).not.toEqual({
                                "some": "data"
                            });
                        });
                });

            });

        });

        describe("when it does NOT have data", function() {

            beforeEach(function() {
                bootstrappedDataService = new BootstrappedDataService();
            });

            it("does NOT mock ajax request", function() {
                bootstrappedDataService.checkAlreadyHasData(method, model, options);

                wait("for ajax call to complete").until(ajaxRequestModelData())
                    .then(function(data) {
                        expect(data).not.toEqual({
                            "some": "data"
                        });
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
// Copyright (C) 2014 Bloomberg L.P.
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
