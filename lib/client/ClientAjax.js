"use strict";

var Promise = require("bluebird");
var Backbone = require("backbone");
var BootstrappedDataService = require("./BootstrappedDataService");
var ClientTestable = require("./ClientTestable");
var pathJoin = require("../util/pathJoin");
var _ = require("underscore");

var originalAjax = Backbone.ajax;

var ClientAjax = {

    setup: function(bootstrappedData, appRoot) {
        ClientTestable.BackboneNativeAjax.Promise = Promise;

        BootstrappedDataService.load(bootstrappedData);

        Backbone.ajax = function(ajaxConfig) {
            var dataInBootstrappedData = BootstrappedDataService.getFor(ajaxConfig);
            var bubbledError;

            function bubbleErrorFrom(prop) {
                var callback = ajaxConfig[prop];

                if (!_.isFunction(callback)) {
                    return;
                }

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
                if (_.isFunction(ajaxConfig.success)) {
                    ajaxConfig.success(dataInBootstrappedData);
                }

                if (bubbledError) {
                    return Promise.reject(bubbledError);
                }

                return Promise.resolve(dataInBootstrappedData);
            }

            bubbleErrorFrom("error");

            ajaxConfig.url = pathJoin(appRoot, ajaxConfig.url);

            return ClientTestable.BackboneNativeAjax(ajaxConfig)
                .lastly(function(data) {
                    if (bubbledError) {
                        throw bubbledError;
                    }

                    return data;
                });
        };
    },

    reset: function() {
        Backbone.ajax = originalAjax;
    }

};

module.exports = ClientAjax;
