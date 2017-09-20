"use strict";

const Benchmark = require("benchmark");
const prettyOutput = require("beautify-benchmark");
const Brisket = require("../lib/brisket");
const BrisketTesting = require("../testing");
const ServerDispatcher = require("../lib/server/ServerDispatcher");

BrisketTesting.setup();

const Layout = Brisket.Layout.extend({

    template: "<!DOCTYPE html>\n<html><head><title>sample</title></head><body></body></html>",

    content: "body"

});

const Router = Brisket.Router.extend({

    layout: Layout,

    routes: {
        "path": "handler"
    },

    handler: function() {
        return new Brisket.View();
    }

});

new Router();

const mockRequest = {
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

const suite = new Benchmark.Suite("Server route dispatch", {
    onStart() {
        /* eslint-disable no-console */
        console.log(`${ this.name }:`);
    }
});

suite
    .add({
        name: "with simple View",
        maxTime: 2,
        defer: true,
        "fn": function(deferred) {
            ServerDispatcher.dispatch("path", mockRequest, {})
                .content
                .then(function() {
                    deferred.resolve();
                });
        }
    })

    .on("cycle", function(event) {
        prettyOutput.add(event.target);
    })
    .on("complete", function() {
        prettyOutput.log();
    })
    .run();
