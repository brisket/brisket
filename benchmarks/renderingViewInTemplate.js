"use strict";

const Benchmark = require("benchmark");
const prettyOutput = require("beautify-benchmark");
const BrisketTesting = require("../testing");
const View = require("../lib/viewing/View");

BrisketTesting.setup();

const ChildView = View.extend();

const ParentView = View.extend({

    template: function(data) {
        return "<div class='other-el'></div>" + data.views["child"];
    },

    beforeRender: function() {
        this.createChildView("child", ChildView);
    }

});

const ParentView2 = View.extend({

    template: "<div class='other-el'></div><div id='child'></div>",

    beforeRender: function() {
        this.createChildView("child", ChildView)
            .andReplace("#child");
    }

});

const ParentView3 = View.extend({

    template: "<div class='other-el'></div>",

    beforeRender: function() {
        this.createChildView("child", ChildView)
            .andAppendIt();
    }

});

let parentView;

const suite = new Benchmark.Suite("Rendering child views in template", {
    onStart() {
        /* eslint-disable no-console */
        console.log(`${ this.name }:`);
    }
});

suite
    .add("child views in template", function() {
        parentView = new ParentView();
        parentView.render().el.outerHTML;
    })

    .add("child views by replacing a node via parent view", function() {
        parentView = new ParentView2();
        parentView.render().el.outerHTML;
    })

    .add("child views by appending them via parent view", function() {
        parentView = new ParentView3();
        parentView.render().el.outerHTML;
    })

    .on("cycle", function(event) {
        prettyOutput.add(event.target);
    })
    .on("complete", function() {
        prettyOutput.log();
    })
    .run();
