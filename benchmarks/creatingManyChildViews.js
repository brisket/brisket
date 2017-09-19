"use strict";

const Benchmark = require("benchmark");
const prettyOutput = require("beautify-benchmark");
const Brisket = require("../lib/brisket");
const BrisketTesting = require("../testing");
const View = require("../lib/viewing/View");

const ParentView = View.extend();
const ChildView = View.extend();

BrisketTesting.setup();

const parentView = new ParentView();

function reset() {
    parentView = new ParentView();
    childViewInstance = new ChildView();
}

const suite = new Benchmark.Suite("Creating many child views", {
    onStart() {
        console.log(`${ this.name }:`);
    }
});

suite
    .add({
        name: "with simple View",
        maxTime: 2,
        "fn": function(deferred) {
            let i = 100;

            while(i > 0) {
                parentView.createChildView(ChildView);

                i--;
            }
        }
    })

    .on("cycle", function(event) {
        prettyOutput.add(event.target)
    })
    .on("complete", function() {
        prettyOutput.log();
    })
    .run();
