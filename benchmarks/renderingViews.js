"use strict";

const Benchmark = require("benchmark");
const prettyOutput = require("beautify-benchmark");
const Brisket = require("../lib/brisket");
const BrisketTesting = require("../testing");
const View = require("../lib/viewing/View");

const EmptyView = View.extend();

const ViewWithMarkup = View.extend({
    template: "<div id='div-0'><span></span></div>"
});

const ViewWithALotOfMarkup = View.extend({

    template: function() {
        let markup = "";
        let i = 100;

        while(i > 0) {
            markup += "<div id='div-" + i + "'><span></span></div>";

            i--;
        }

        return markup;
    }()

});

BrisketTesting.setup();

const suite = new Benchmark.Suite("Rendering views", {
    onStart() {
        console.log(`${ this.name }:`);
    }
});

suite
    .add("empty View", function() {
        (new EmptyView()).render();
    })

    .add("View with markup", function() {
        (new ViewWithMarkup()).render();
    })

    .add("View with a lot of markup", function() {
        (new ViewWithALotOfMarkup()).render();
    })

    .on("cycle", function(event) {
        prettyOutput.add(event.target)
    })
    .on("complete", function() {
        prettyOutput.log();
    })
    .run();
