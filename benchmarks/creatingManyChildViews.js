"use strict";

var Brisket = require("../lib/brisket");
var BrisketTesting = require("../testing");
var View = require("../lib/viewing/View");

var ParentView = View.extend();
var ChildView = View.extend();

BrisketTesting.setup();

var parentView = new ParentView();

function reset() {
    parentView = new ParentView();
    childViewInstance = new ChildView();
}

module.exports = {
    name: "Creating many child views",
    maxTime: 2,
    fn: function() {
        var i = 100;

        while(i > 0) {
            parentView.createChildView(ChildView);

            i--;
        }
    }
};
