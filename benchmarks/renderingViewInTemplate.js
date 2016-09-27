"use strict";

var Brisket = require("../lib/brisket");
var BrisketTesting = require("../testing");
var View = require("../lib/viewing/View");

BrisketTesting.setup();

var ChildView = View.extend();

var ParentView = View.extend({

    template: function(data) {
        return "<div class='other-el'></div>" + data.views["child"];
    },

    beforeRender: function() {
        this.createChildView("child", ChildView);
    }

});

var ParentView2 = View.extend({

    template: "<div class='other-el'></div><div id='child'></div>",

    beforeRender: function() {
        this.createChildView("child", ChildView)
            .andReplace("#child");
    }

});

var ParentView3 = View.extend({

    template: "<div class='other-el'></div>",

    beforeRender: function() {
        this.createChildView("child", ChildView)
            .andAppendIt();
    }

});

var parentView;

module.exports = {
    name: "Rendering child views in template",
    maxTime: 2,
    tests: {

        "child views in template": function() {
            parentView = new ParentView();
            parentView.render().el.outerHTML;
        },

        "child views by replacing a node via parent view": function() {
            parentView = new ParentView2();
            parentView.render().el.outerHTML;
        },

        "child views by appending them via parent view": function() {
            parentView = new ParentView3();
            parentView.render().el.outerHTML;
        }

    }
};
