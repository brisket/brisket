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
    });

    afterEach(function() {
        bootstrappedDataService.clearMockedData();
    });

    describe("#checkAlreadyHasData", function() {
        var makeAjaxRequest;

        beforeEach(function() {
            bootstrappedData = {
                "/url": {
                    "data-type": "none"
                },
                '/url%7B%22query%22%3A%22param%22%7D': {
                    "data-type": "object"
                },
                '/url%22query%3Dparam%22': {
                    "data-type": "string"
                },
                '/url%5B%22query1%3Dparam1%22%2C%22query2%3Dparam2%22%5D': {
                    "data-type": "array"
                }
            };
        });

        describe("when there is bootstrapped data and request does NOT have query params", function() {
            beforeEach(function() {
                options = {};
                bootstrappedDataService = new BootstrappedDataService(bootstrappedData);
                bootstrappedDataService.checkAlreadyHasData(method, model, options);
                makeAjaxRequest = ajaxRequestModelData;
            });

            itMocksAjaxCallsFor("/url");
        });

        describe("when there is bootstrapped data and request has object query params", function() {
            beforeEach(function() {
                options = {
                    data: {
                        query: "param"
                    }
                };

                bootstrappedDataService = new BootstrappedDataService(bootstrappedData);
                bootstrappedDataService.checkAlreadyHasData(method, model, options);
                makeAjaxRequest = ajaxRequestModelDataWithQueryParams;
            });

            itMocksAjaxCallsFor('/url' + encodeURIComponent('{"query":"param"}'));
        });

        describe("when there is bootstrapped data and request has string query params ", function() {
            beforeEach(function() {
                options = {
                    data: "query=param"
                };

                bootstrappedDataService = new BootstrappedDataService(bootstrappedData);
                bootstrappedDataService.checkAlreadyHasData(method, model, options);
                makeAjaxRequest = ajaxRequestModelDataWithQueryParams;
            });

            itMocksAjaxCallsFor('/url' + encodeURIComponent('"query=param"'));
        });

        describe("when there is bootstrapped data and request has array query params ", function() {
            beforeEach(function() {
                options = {
                    data: ["query1=param1", "query2=param2"]
                };

                bootstrappedDataService = new BootstrappedDataService(bootstrappedData);
                bootstrappedDataService.checkAlreadyHasData(method, model, options);
                makeAjaxRequest = ajaxRequestModelDataWithQueryParams;
            });

            itMocksAjaxCallsFor('/url' + encodeURIComponent('["query1=param1","query2=param2"]'));
        });

        describe("when there is no bootstrapped data and request does NOT have query params", function() {
            beforeEach(function() {
                options = {};
                bootstrappedDataService = new BootstrappedDataService();
                bootstrappedDataService.checkAlreadyHasData(method, model, options);
                makeAjaxRequest = ajaxRequestModelData;
            });

            itDoesNotMockAjaxCallsFor("/url");
        });

        describe("when there is no bootstrapped data and request has query params", function() {
            beforeEach(function() {
                options = {
                    data: {
                        query: "param"
                    }
                };

                bootstrappedDataService = new BootstrappedDataService();
                bootstrappedDataService.checkAlreadyHasData(method, model, options);
                makeAjaxRequest = ajaxRequestModelDataWithQueryParams;
            });

            itDoesNotMockAjaxCallsFor('/url' + encodeURIComponent('{"query":"param"}'));
        });

        function itMocksAjaxCallsFor(url) {
            it("mocks out the next ajax call", function(done) {
                var expectedData = bootstrappedData[url];

                makeAjaxRequest().then(function(data) {
                    expect(data).toEqual(expectedData);
                    done();
                });
            });

            it("does NOT mock subsequent ajax calls", function(done) {
                var expectedData = bootstrappedData[url];

                var fetchingTwice = makeAjaxRequest()
                    .then(function() {
                        bootstrappedDataService.checkAlreadyHasData(method, model, options);
                        return makeAjaxRequest();
                    });

                //  using always because this is a jquery promise AND it fails on the second
                //  call since an ajax call to /url in the tests won't succeed. this
                //  expectation only cares that the mock data is NOT returned again so that's ok.
                //  wawjr3d 10/17/2014
                fetchingTwice.always(function(data) {
                    expect(data).not.toEqual(expectedData);
                    done();
                });
            });
        }

        function itDoesNotMockAjaxCallsFor(url) {
            it("does NOT mock the next ajax request", function(done) {
                var expectedData = bootstrappedData[url];

                makeAjaxRequest().always(function(data) {
                    expect(data).not.toEqual(expectedData);
                    done();
                });
            });
        }
    });

    function ajaxRequestModelData() {
        return $.ajax({
            url: "/url",
            dataType: "json"
        });
    }

    function ajaxRequestModelDataWithQueryParams() {
        return $.ajax({
            url: "/url",
            dataType: "json",
            data: {
                query: "param"
            }
        });
    }
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
