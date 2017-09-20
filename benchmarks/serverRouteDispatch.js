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
        return new Brisket.View()
            .withMetatags(new Brisket.Layout.Metatags({
                "canonical": "http://www.example.com",
                "description": "summary",
                "og:image": "http://www.example.com/image.png",
                "twitter:card": "summary",
                "twitter:site": "business",
                "twitter:description": "summary",
                "twitter:title": "title",
                "twitter:url": "url",
                "og:description": "summary",
                "og:title": "title",
                "og:url": "url",
                "parsely-title": "title",
                "parsely-link": "url",
                "parsely-type": "frontpage",
                "parsely-section": "home"
            }));
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

let html;

const suite = new Benchmark.Suite("Server route dispatch", {
    onStart() {
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
                .then(function(renderedHtml) {
                    html = renderedHtml;
                    deferred.resolve();
                });
        }
    })

    .on("cycle", function(event) {
        prettyOutput.add(event.target)
    })
    .on("complete", function() {
        prettyOutput.log();
    })
    .run();
