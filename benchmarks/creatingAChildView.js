"use strict";

var Brisket = require("../lib/brisket");
var View = require("../lib/viewing/View");

var ParentView = View.extend();
var ChildView = View.extend();

Brisket.Testing.setup();

var parentView;
var childViewInstance;

function reset() {
    parentView = new ParentView();
    childViewInstance = new ChildView();
}

module.exports = {
    name: "Creating a child view",
    maxTime: 2,
    tests: {

        "creating child View with View constructor": function() {
            reset();
            parentView.createChildView(ParentView);
        },

        "creating child View with View constructor and options": function() {
            reset();
            parentView.createChildView(ParentView)
                .withOptions({
                    some: "data"
                });
        },

        "creating child View with instance of a View": function() {
            reset();
            parentView.createChildView(childViewInstance);
        },

        "creating child View with an identifier": function() {
            reset();
            parentView.createChildView("identifier", childViewInstance);
        }

    }
};
