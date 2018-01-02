"use strict";

const Benchmark = require("benchmark");
const prettyOutput = require("beautify-benchmark");
const isApplicationLink = require("../lib/controlling/isApplicationLink");

const suite = new Benchmark.Suite("Checking if a link is application link", {
    onStart() {
        /* eslint-disable no-console */
        console.log(`${ this.name }:`);
    }
});

suite
    .add("hash link", function() {
        isApplicationLink("#top");
    })

    .add("fully qualified link", function() {
        isApplicationLink("http://www.somewhere.com");
    })

    .add("absolute link", function() {
        isApplicationLink("/absolute/path");
    })

    .add("mailto link", function() {
        isApplicationLink("mailto:someone@example.com");
    })

    .add("javascript code link", function() {
        isApplicationLink("javascript:{}");
    })

    .add("application link", function() {
        isApplicationLink("application/link");
    })

    .on("cycle", function(event) {
        prettyOutput.add(event.target);
    })
    .on("complete", function() {
        prettyOutput.log();
    })
    .run();
