"use strict";

const Benchmark = require("benchmark");
const prettyOutput = require("beautify-benchmark");
const Brisket = require("../lib/brisket");
const BrisketTesting = require("../testing");
const View = require("../lib/viewing/View");

const ParentView = View.extend();
const ChildView = View.extend();

BrisketTesting.setup();

let parentView;
let childViewInstance;

function reset() {
    parentView = new ParentView();
    childViewInstance = new ChildView();
}


const suite = new Benchmark.Suite("Creating a child view", {
    onStart() {
        console.log(`${ this.name }:`);
    }
});

suite
    .add("creating child View with View constructor", function() {
        reset();
        parentView.createChildView(ParentView);
    })

    .add("creating child View with View constructor and options", function() {
        reset();
        parentView.createChildView(ParentView)
            .withOptions({
                some: "data"
            });
    })

    .add("creating child View with instance of a View", function() {
        reset();
        parentView.createChildView(childViewInstance);
    })

    .add("creating child View with an identifier", function() {
        reset();
        parentView.createChildView("identifier", childViewInstance);
    })

    .on("cycle", function(event) {
        prettyOutput.add(event.target)
    })
    .on("complete", function() {
        prettyOutput.log();
    })
    .run();
