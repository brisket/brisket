"use strict";

var BootstrappedDataService = require("lib/client/BootstrappedDataService");

describe("BootstrappedDataService", function() {

    var bootstrappedData;
    var dataForUrl;
    var bootstrappedDataService;
    var method;
    var model;
    var options;
    var returnData;

    beforeEach(function() {
        method = "read";
        model = {
            url: "/url"
        };
        options = {};
        returnData = jasmine.createSpy("readData");
    });

    afterEach(function() {
        bootstrappedDataService.clearAll();
    });

    describe("#isBootstrapped", function() {

        describe("when it has data for url", function() {

            beforeEach(function() {
                dataForUrl = {
                    "some": "data"
                };

                bootstrappedData = {
                    "/url": dataForUrl
                };

                bootstrappedDataService = new BootstrappedDataService(bootstrappedData);
            });

            it("calls returnData with bootstrapped data", function() {
                bootstrappedDataService.isBootstrapped(method, model, options, returnData);

                expect(returnData).toHaveBeenCalledWith(dataForUrl);
            });

            it("does NOT call returnData on second request for same url", function() {
                bootstrappedDataService.isBootstrapped(method, model, options, returnData);

                returnData = jasmine.createSpy("secondReturnData");
                bootstrappedDataService.isBootstrapped(method, model, options, returnData);

                expect(returnData).not.toHaveBeenCalled();
            });

        });

        describe("when it does NOT have data", function() {

            beforeEach(function() {
                bootstrappedDataService = new BootstrappedDataService();
            });

            it("does NOT call returnData", function() {
                bootstrappedDataService.isBootstrapped(method, model, options, returnData);

                expect(returnData).not.toHaveBeenCalled();
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
