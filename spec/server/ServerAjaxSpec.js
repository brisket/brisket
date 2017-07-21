"use strict";

describe("ServerAjax", function() {
    var ServerAjax = require("../../lib/server/ServerAjax");
    var AjaxCallsForCurrentRequest = require("../../lib/server/AjaxCallsForCurrentRequest");
    var Testable = require("../../lib/util/Testable");
    var Promise = require("bluebird");
    var Backbone = require("backbone");

    var successCallback;
    var errorCallback;

    afterEach(function() {
        ServerAjax.reset();
    });

    describe("when apis config available", function() {

        beforeEach(function() {
            successCallback = jasmine.createSpy();
            errorCallback = jasmine.createSpy();

            spyOn(AjaxCallsForCurrentRequest, "record");

            ServerAjax.setup({
                "api": {
                    host: "http://api.example.com",
                    proxy: "http://proxy.example.com"
                },
                "nav": {
                    host: "http://other-api.example.com",
                    timeout: 5000
                }
            });
        });

        it("sends request to the correct api", function() {
            givenApiRequestWillSucceed();

            Backbone.ajax({
                url: "/api/path/to/data"
            });

            thenRequestMadeWith({
                url: "http://api.example.com/path/to/data",
                proxy: "http://proxy.example.com",
                method: "GET",
                timeout: null
            });

            Backbone.ajax({
                url: "/nav/path/to/data"
            });

            thenRequestMadeWith({
                url: "http://other-api.example.com/path/to/data",
                method: "GET",
                timeout: 5000
            });
        });

        it("errors when url doesn't match any api", function() {
            givenApiRequestWillSucceed();

            expect(function() {
                Backbone.ajax({
                    url: "/unknown/path/to/data"
                });
            }).toThrow();
        });

        it("sends request to the correct api when leading slash left off", function() {
            givenApiRequestWillSucceed();

            Backbone.ajax({
                url: "api/path/to/data"
            });

            thenRequestMadeWith({
                url: "http://api.example.com/path/to/data",
                proxy: "http://proxy.example.com",
                method: "GET",
                timeout: null
            });

            Backbone.ajax({
                url: "nav/path/to/data"
            });

            thenRequestMadeWith({
                url: "http://other-api.example.com/path/to/data",
                method: "GET",
                timeout: 5000
            });
        });

        it("sends request with query params when they are passed", function(done) {
            givenApiRequestWillSucceed();

            Backbone.ajax({
                url: "/api/path/to/data",
                data: {
                    a: "param1",
                    b: [
                        "b1",
                        "b2"
                    ]
                }
            })
                .then(function() {
                    thenRequestMadeWith({
                        url: "http://api.example.com/path/to/data?a=param1&b=b1%2Cb2",
                        method: "GET",
                        timeout: null
                    });

                    thenAjaxCallIsRecorded("/api/path/to/data", {
                        a: "param1",
                        b: [
                            "b1",
                            "b2"
                        ]
                    }, {
                        some: "data"
                    });
                })
                .finally(done);
        });

        it("sends request with headers when they are passed", function(done) {
            givenApiRequestWillSucceed();

            Backbone.ajax({
                url: "/api/path/to/data",
                headers: {
                    "x-my-custom-header": "some value",
                    "x-some-other-header": "some other value"
                }
            })
                .then(function() {
                    thenRequestMadeWith({
                        url: "http://api.example.com/path/to/data",
                        method: "GET",
                        headers: {
                            "x-my-custom-header": "some value",
                            "x-some-other-header": "some other value"
                        },
                        timeout: null
                    });

                    thenAjaxCallIsRecorded("/api/path/to/data", undefined, {
                        some: "data"
                    });
                })
                .finally(done);
        });

        it("calls success callback with returned data when api request succceeds", function(done) {
            givenApiRequestWillSucceed();

            Backbone.ajax({
                url: "/api/path/to/data",
                success: successCallback,
                error: errorCallback
            })
                .then(function() {
                    expect(successCallback).toHaveBeenCalledWith({
                        some: "data"
                    });

                    expect(errorCallback).not.toHaveBeenCalled();

                    thenAjaxCallIsRecorded("/api/path/to/data", undefined, {
                        some: "data"
                    });
                })
                .finally(done);
        });

        it("calls success callback with returned non-JSON data when api request succeeds", function(done) {
            givenApiRequestWillSucceedNonJSON();

            Backbone.ajax({
                url: "/api/path/to/data",
                success: successCallback,
                error: errorCallback,
            })
                .then(function() {
                    expect(successCallback).toHaveBeenCalledWith("data");
                    expect(errorCallback).not.toHaveBeenCalled();
                    thenAjaxCallIsRecorded("/api/path/to/data", undefined, "data");
                })
                .finally(done);
        });

        it("calls error callback with returned data when api request succceeds", function(done) {
            givenApiRequestWillFail();

            Backbone.ajax({
                url: "/api/path/to/data",
                success: successCallback,
                error: errorCallback
            })
                .catch(function() {
                    expect(errorCallback).toHaveBeenCalledWith({
                        proxy: "http://proxy.example.com",
                        url: "http://api.example.com/path/to/data",
                        status: 500,
                        response: JSON.stringify({
                            error: "reason"
                        })
                    }, 500, new Error("Server responded with a status of 500"));

                    expect(successCallback).not.toHaveBeenCalled();

                    thenAjaxCallIsNOTRecorded();
                })
                .finally(done);
        });

        it("bubbles error from success callback", function(done) {
            givenApiRequestWillSucceed();

            var error = new Error();

            successCallback.and.throwError(error);

            Backbone.ajax({
                url: "/api/path/to/data",
                success: successCallback,
                error: errorCallback
            })
                .catch(function(reason) {
                    expect(reason).toBe(error);
                })
                .finally(done);
        });

        it("bubbles error from error callback", function(done) {
            givenApiRequestWillFail();

            var error = new Error();

            errorCallback.and.throwError(error);

            Backbone.ajax({
                url: "/api/path/to/data",
                success: successCallback,
                error: errorCallback
            })
                .catch(function(reason) {
                    expect(reason).toBe(error);
                })
                .finally(done);
        });

        describe("apis alias has slashes", function() {

            beforeEach(function() {
                ServerAjax.setup({
                    "api": {
                        host: "http://api.example.com",
                        proxy: "http://proxy.example.com"
                    },
                    "markets/api": {
                        host: "http://markets.example.com",
                        timeout: 5000
                    }
                });
            });

            it("sends request to the correct api", function() {
                givenApiRequestWillSucceed();

                Backbone.ajax({
                    url: "/markets/api/path/to/data"
                });

                thenRequestMadeWith({
                    url: "http://markets.example.com/path/to/data",
                    method: "GET",
                    timeout: 5000
                });

                Backbone.ajax({
                    url: "/api/path/to/data"
                });

                thenRequestMadeWith({
                    url: "http://api.example.com/path/to/data",
                    proxy: "http://proxy.example.com",
                    method: "GET",
                    timeout: null
                });
            });
        });

    });

    function givenApiRequestWillSucceedNonJSON() {
        spyOn(Testable, "requestPromise").and.returnValue(Promise.resolve([{
            statusCode: 200,
            headers: {
                "content-type": "text/html"
            },
            body: "data"
        }]));
    }

    function givenApiRequestWillSucceed() {
        spyOn(Testable, "requestPromise").and.returnValue(Promise.resolve({
            statusCode: 200,
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                some: "data"
            })
        }));
    }

    function givenApiRequestWillFail() {
        spyOn(Testable, "requestPromise").and.returnValue(Promise.resolve({
            statusCode: 500,
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                error: "reason"
            })
        }));
    }

    function thenAjaxCallIsRecorded(originalUrl, queryParams, data) {
        expect(AjaxCallsForCurrentRequest.record).toHaveBeenCalledWith(originalUrl, queryParams, data);
    }

    function thenAjaxCallIsNOTRecorded() {
        expect(AjaxCallsForCurrentRequest.record).not.toHaveBeenCalled();
    }

    function thenRequestMadeWith(options) {
        expect(Testable.requestPromise).toHaveBeenCalledWith(
            jasmine.objectContaining(options)
        );
    }

});
