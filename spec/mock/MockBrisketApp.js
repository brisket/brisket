"use strict";

var Brisket = require("../../lib/brisket");
var Backbone = Brisket.Backbone;
var ServerDispatcher = require("../../lib/server/ServerDispatcher");
var App = require("../../lib/application/App");

var MockBrisketApp = {

    initialize() {
        var Layout = Brisket.Layout.extend({
            template: "<!DOCTYPE html>\n<html><head><title>New App</title></head><body></body></html>",
            content: "body"
        });

        var PageNotFoundView = Brisket.View.extend({ className: "not-found" });
        var ErrorView = Brisket.View.extend({ className: "errored" });

        var Router = Brisket.Router.extend({

            layout: Layout,

            errorViewMapping: {
                404: PageNotFoundView,
                500: ErrorView
            },

            routes: {
                "working": "working",
                "failing": "failing",
                "redirecting": "redirecting",
                "setsStatus": "setsStatus",
                "fetch200": "fetch200",
                "fetch200ButRouteFails": "fetch200ButRouteFails",
                "fetch200ButRouteRedirects": "fetch200ButRouteRedirects",
                "fetch200ButRouteSetsStatus": "fetch200ButRouteSetsStatus",
                "fetch404": "fetch404",
                "fetch500": "fetch500",
                "fetch410": "fetch410"
            },

            working() {
                return new Brisket.View();
            },

            failing() {
                willThrow();

                return new Brisket.View();
            },

            redirecting(setLayoutData, request, response) {
                response.redirect("/working");

                return new Brisket.View();
            },

            setsStatus(setLayoutData, request, response) {
                response.status(206);

                return new Brisket.View();
            },

            fetch200() {
                return Backbone.ajax({
                    url: "/api/fetch200"
                })
                .then(function() {
                    return new Brisket.View();
                });
            },

            fetch200ButRouteFails() {
                return Backbone.ajax({
                    url: "/api/fetch200"
                })
                .then(function() {
                    willThrow();

                    return new Brisket.View();
                });
            },

            fetch200ButRouteRedirects(setLayoutData, request, response) {
                return Backbone.ajax({
                    url: "/api/fetch200"
                })
                .then(function() {
                    response.redirect("/working");

                    return new Brisket.View();
                });
            },

            fetch200ButRouteSetsStatus(setLayoutData, request, response) {
                return Backbone.ajax({
                    url: "/api/fetch200"
                })
                .then(function() {
                    response.status(206);

                    return new Brisket.View();
                });
            },

            fetch404() {
                return Backbone.ajax({
                    url: "/api/fetch404"
                })
                .then(function() {
                    return new Brisket.View();
                });
            },

            fetch500() {
                return Backbone.ajax({
                    url: "/api/fetch500"
                })
                .then(function() {
                    return new Brisket.View();
                });
            },

            fetch410() {
                return Backbone.ajax({
                    url: "/api/fetch410"
                })
                .then(function() {
                    return new Brisket.View();
                });
            }

        });

        new Router();
    },

    cleanup() {
        ServerDispatcher.reset();
        App.reset();
    }

};

function willThrow() {
    throw "an error";
}

module.exports = MockBrisketApp;
