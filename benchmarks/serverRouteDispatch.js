"use strict";

var Brisket = require("../lib/brisket");
var BrisketTesting = require("../testing");
var ServerDispatcher = require("../lib/server/ServerDispatcher");

BrisketTesting.setup();

var Layout = Brisket.Layout.extend({

    template: "<!DOCTYPE html>\n<html><head><title>sample</title></head><body></body></html>",

    content: "body"

});

var Router = Brisket.Router.extend({

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
                ServerDispatcher.dispatch("path", mockRequest, {})
                    .content
                    .then(function(renderedHtml) {
                        html = renderedHtml;
                        deferred.resolve();
                    });
            }
        }

    }
};
