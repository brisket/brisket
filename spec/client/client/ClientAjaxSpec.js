"use strict";

describe("ClientAjax", function() {
    var ClientAjax = require("lib/client/ClientAjax");
    var ClientTestable = require("lib/client/ClientTestable");
    var Promise = require("bluebird");
    var Backbone = require("backbone");
    var _ = require("underscore");

    var bootstrappedData;
    var appRoot;
    var successCallback;
    var errorCallback;
    var ajaxConfig;
    var error;

    beforeEach(function() {
        bootstrappedData = {
            "/api/from/bootstrappedData%7B%22param%22%3A%22value%22%7D": {
                "from": "bootstrappedData"
            }
        };

        successCallback = jasmine.createSpy();
        errorCallback = jasmine.createSpy();
    });

    afterEach(function() {
        ClientAjax.reset();
    });

    describe("when there is NO appRoot", function() {

        beforeEach(function() {
            appRoot = "";

            ClientAjax.setup(bootstrappedData, appRoot);
        });

        it("makes ajax call with config passed to it", function(done) {
            givenAjaxCallWillSucceed();

            Backbone.ajax(supportedAjaxConfig())
                .then(function() {
                    expect(ClientTestable.BackboneNativeAjax).toHaveBeenCalledWith(jasmine.objectContaining({
                        url: "/api/url",
                        type: "GET",
                        data: {
                            "param": "value"
                        },
                        headers: {
                            "x-my-custom-header": "some value",
                        }
                    }));
                })
                .finally(done);
        });

        it("does NOT make ajax call when data for url in bootstrappedData", function(done) {
            ajaxConfig = supportedAjaxConfig({
                url: "/api/from/bootstrappedData"
            });

            Backbone.ajax(ajaxConfig)
                .then(function(data) {
                    expect(data).toEqual({
                        "from": "bootstrappedData"
                    });
                })
                .finally(done);
        });

        it("calls success callback when data for url in bootstrappedData", function(done) {
            ajaxConfig = supportedAjaxConfig({
                url: "/api/from/bootstrappedData",
                success: successCallback,
                error: errorCallback
            });

            Backbone.ajax(ajaxConfig)
                .then(function() {
                    expect(successCallback).toHaveBeenCalledWith({
                        from: "bootstrappedData"
                    });
                    expect(errorCallback).not.toHaveBeenCalled();
                })
                .finally(done);
        });

        it("rejects with error when success callback has an error when data for url in bootstrappedData", function(done) {
            error = new Error();

            successCallback.and.throwError(error);

            ajaxConfig = supportedAjaxConfig({
                url: "/api/from/bootstrappedData",
                success: successCallback,
                error: errorCallback
            });

            Backbone.ajax(ajaxConfig)
                .catch(function(reason) {
                    expect(reason).toBe(error);
                })
                .finally(done);
        });

        it("bubbles error from success callback", function(done) {
            givenAjaxCallWillSucceed();

            error = new Error();

            successCallback.and.throwError(error);

            ajaxConfig = supportedAjaxConfig({
                url: "/api/path/to/data",
                success: successCallback,
                error: errorCallback
            });

            Backbone.ajax(ajaxConfig)
                .catch(function(reason) {
                    expect(reason).toBe(error);
                })
                .finally(done);
        });

        it("bubbles error from error callback", function(done) {
            givenAjaxCallWillFail();

            error = new Error();

            errorCallback.and.throwError(error);

            ajaxConfig = supportedAjaxConfig({
                url: "/api/path/to/data",
                success: successCallback,
                error: errorCallback
            });

            Backbone.ajax(ajaxConfig)
                .catch(function(reason) {
                    expect(reason).toBe(error);
                })
                .finally(done);
        });

    });

    describe("when there is an appRoot", function() {

        beforeEach(function() {
            appRoot = "/root";

            ClientAjax.setup(bootstrappedData, appRoot);
        });

        it("makes ajax call with appRoot", function(done) {
            givenAjaxCallWillSucceed();

            ajaxConfig = supportedAjaxConfig();

            Backbone.ajax(ajaxConfig)
                .then(function() {
                    expect(ClientTestable.BackboneNativeAjax).toHaveBeenCalledWith(jasmine.objectContaining({
                        url: "/root/api/url",
                        type: "GET",
                        data: {
                            "param": "value"
                        },
                        headers: {
                            "x-my-custom-header": "some value",
                        }
                    }));
                })
                .finally(done);
        });

    });

    function supportedAjaxConfig(extra) {
        return _.extend({
            url: "/api/url",
            type: "GET",
            data: {
                "param": "value"
            },
            headers: {
                "x-my-custom-header": "some value",
            }
        }, extra);
    }

    function givenAjaxCallWillSucceed() {
        spyOn(ClientTestable, "BackboneNativeAjax").and.callFake(function(ajaxConfig) {
            if (ajaxConfig.success) {
                ajaxConfig.success();
            }

            return Promise.resolve({
                some: "data"
            });
        });
    }

    function givenAjaxCallWillFail() {
        spyOn(ClientTestable, "BackboneNativeAjax").and.callFake(function(ajaxConfig) {
            if (ajaxConfig.error) {
                ajaxConfig.error();
            }

            return Promise.reject({
                error: "reason"
            });
        });
    }

});
