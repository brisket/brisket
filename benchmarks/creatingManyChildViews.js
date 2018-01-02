"use strict";

const Benchmark = require("benchmark");
const prettyOutput = require("beautify-benchmark");
const BrisketTesting = require("../testing");
const View = require("../lib/viewing/View");

const ParentView = View.extend();
const ChildView = View.extend();

BrisketTesting.setup();

const parentView = new ParentView();

const suite = new Benchmark.Suite("Creating many child views", {
    onStart() {
        /* eslint-disable no-console */
        console.log(`${ this.name }:`);
    }
});

suite
    .add({
        name: "with simple View",
        maxTime: 2,
        "fn": function() {
            let i = 100;

            while (i > 0) {
                parentView.createChildView(ChildView);

                i--;
            }
        }
    })

    .on("cycle", function(event) {
        prettyOutput.add(event.target);
    })
    .on("complete", function() {
        prettyOutput.log();
    })
    .run();
