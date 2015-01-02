"use strict";

var View = require("lib/viewing/View");
var Layout = require("lib/viewing/Layout");
var ErrorViewMapping = require("lib/errors/ErrorViewMapping");
var noop = require("lib/util/noop");

var PageNotFoundView = View.extend({
    name: "page_not_found"
});

var ErrorView = View.extend({
    name: "unhandled_error"
});

var ExampleLayout = Layout.extend({
    template: "<div></div>",
    content: "div",

    customMethod: noop
});

var MockRouter = {

    create: function() {
        return {
            layout: ExampleLayout,
            errorViewMapping: ErrorViewMapping.create({
                404: PageNotFoundView,
                500: ErrorView
            }),
            onRouteStart: jasmine.createSpy(),
            onRouteComplete: jasmine.createSpy(),
            close: jasmine.createSpy()
        };
    }

};

module.exports = MockRouter;
