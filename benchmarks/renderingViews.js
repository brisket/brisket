"use strict";

var Brisket = require("../lib/brisket");
var View = require("../lib/viewing/View");

var EmptyView = View.extend();

var ViewWithMarkup = View.extend({
    template: "<div id='div-0'><span></span></div>"
});

var ViewWithALotOfMarkup = View.extend({

    template: function() {
        var markup = "";
        var i = 100;

        while(i > 0) {
            markup += "<div id='div-" + i + "'><span></span></div>";

            i--;
        }

        return markup;
    }()

});

Brisket.Testing.setup();


module.exports = {
    name: "Rendering views",
    maxTime: 2,
    tests: {

        "empty View": function() {
            (new EmptyView()).render();
        },

        "View with markup": function() {
            (new ViewWithMarkup()).render();
        },

        "View with a lot of markup": function() {
            (new ViewWithALotOfMarkup()).render();
        }

    }
};
