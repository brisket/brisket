"use strict";

var BootstrappedDataService = require("./BootstrappedDataService");
var Backbone = require("backbone");
var BackboneNativeAjax = require("backbone.nativeajax");
var Promise = require("bluebird");

var ClientAjax = {

    setup: function(bootstrappedData) {
        BackboneNativeAjax.Promise = Promise;

        BootstrappedDataService.load(bootstrappedData);

        Backbone.ajax = function(ajaxConfig) {
            var dataInBootstrappedData = BootstrappedDataService.getFor(ajaxConfig);
            var bubbledError;

            function bubbleErrorFrom(prop) {
                var callback = ajaxConfig[prop];

                ajaxConfig[prop] = function() {
                    try {
                        return callback.apply(null, arguments);
                    } catch (e) {
                        bubbledError = e;
                    }
                };
            }

            bubbleErrorFrom("success");

            if (dataInBootstrappedData) {
                ajaxConfig.success(dataInBootstrappedData);

                if (bubbledError) {
                    return Promise.reject(bubbledError);
                }

                return Promise.resolve(dataInBootstrappedData);
            }

            bubbleErrorFrom("error");

            return BackboneNativeAjax.call(Backbone, ajaxConfig)
                .then(function(data) {
                    if (bubbledError) {
                        throw bubbledError;
                    }

                    return data;
                });
        };
    }

};

module.exports = ClientAjax;
