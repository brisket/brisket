"use strict";

describe("BootstrappedDataService", function() {
    var BootstrappedDataService = require("lib/client/BootstrappedDataService");

    var bootstrappedData;

    afterEach(function() {
        BootstrappedDataService.clear();
    });

    describe("when there is bootstrappedData", function() {

        beforeEach(function() {
            bootstrappedData = {
                "/url": {
                    "data-type": "none"
                },
                '/url%7B%22query%22%3A%22param%22%7D': {
                    "data-type": "object"
                },
                '/url%7B%22query%22%3A%5B%22param1%22%2C%22param2%22%5D%7D': {
                    "data-type": "array"
                }
            };

            BootstrappedDataService.load(bootstrappedData);
        });

        itReturnsDataOnlyOnce("when ajaxConfig does NOT have query params", {
            url: "/url"
        });

        itReturnsDataOnlyOnce("when ajaxConfig has object query params", {
            url: "/url",
            data: {
                query: "param"
            }
        });

        itReturnsDataOnlyOnce("when ajaxConfig has query param with array value", {
            url: "/url",
            data: {
                query: ["param1", "param2"]
            }
        });

    });

    describe("when there is no bootstrappedData", function() {

        beforeEach(function() {
            BootstrappedDataService.load();
        });

        itDoesNotReturnData("when ajaxConfig does NOT have query params", {
            url: "/url"
        });

        itDoesNotReturnData("when ajaxConfig has query params", {
            url: "/url",
            data: {
                query: "param"
            }
        });

        itDoesNotReturnData("when ajaxConfig has query param with array value", {
            url: "/url",
            data: {
                query: ["param1", "param2"]
            }
        });

    });

    function itReturnsDataOnlyOnce(describeMessage, ajaxConfig) {
        describe(describeMessage, function() {

            it("returns data only once", function() {
                var key = BootstrappedDataService.computeKey(
                    ajaxConfig.url,
                    ajaxConfig.data
                );

                var expectedData = bootstrappedData[key];

                expect(BootstrappedDataService.getFor(ajaxConfig)).toBe(expectedData);
                expect(BootstrappedDataService.getFor(ajaxConfig)).toBeUndefined();
            });

        });
    }

    function itDoesNotReturnData(describeMessage, ajaxConfig) {
        describe(describeMessage, function() {

            it("does NOT return data", function() {
                expect(BootstrappedDataService.getFor(ajaxConfig)).toBeUndefined();
            });

        });
    }

});

// ----------------------------------------------------------------------------
// Copyright (C) 2017 Bloomberg Finance L.P.
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
