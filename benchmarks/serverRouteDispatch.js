"use strict";

var Brisket = require("../lib/brisket");
var RouterBrewery = Brisket.RouterBrewery;
var ServerDispatcher = require("../lib/server/ServerDispatcher");

Brisket.Testing.setup();

var Router = RouterBrewery.create({

    layout: Brisket.Layout,

    routes: {
        "path": "handler"
    },

    handler: function() {
        return new Brisket.View();
    }

});

new Router();

var mockRequest = {
    protocol: "http",
    path: "/requested/path",
    host: "example.com",
    headers: {
        "host": "example.com:8080",
        "referer": "theReferrer.com",
        "user-agent": "A wonderful computer"
    },
    query: {
        some: "param",
        another: {
            param: "value"
        }
    },
    originalUrl: "/requested/path?some=param&another%5Bparam%5D=value"
};

var html;

module.exports = {
    name: "Server route dispatch",
    maxTime: 2,
    tests: {

        "with simple View": {
            defer: true,
            fn: function(deferred) {
                ServerDispatcher.dispatch("path", mockRequest, {}, "app/ClientApp")
                    .content
                    .then(function(renderedHtml) {
                        html = renderedHtml;
                        deferred.resolve();
                    });
            }
        }

    }
};
