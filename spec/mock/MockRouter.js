"use strict";

var View = require("../../lib/viewing/View");
var Layout = require("../../lib/viewing/Layout");
var _ = require("underscore");

var PageNotFoundView = View.extend({
    name: "page_not_found"
});

var ErrorView = View.extend({
    name: "unhandled_error"
});

var ExampleLayout = Layout.extend({
    template: "<div></div>",
    content: "div"
});

var MockRouter = {

    create: function(options) {
        return _.extend({
            layout: ExampleLayout,
            errorViewMapping: {
                404: PageNotFoundView,
                500: ErrorView
            },
            onRouteStart: jasmine.createSpy(),
            onRouteComplete: jasmine.createSpy(),
            close: jasmine.createSpy()
        }, options);
    }

};

module.exports = MockRouter;
