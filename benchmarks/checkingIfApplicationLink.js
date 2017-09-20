"use strict";

const Benchmark = require("benchmark");
const prettyOutput = require("beautify-benchmark");
const isApplicationLink = require("../lib/controlling/isApplicationLink");

let result;

const suite = new Benchmark.Suite("Checking if a link is application link", {
    onStart() {
        console.log(`${ this.name }:`);
    }
});

suite
    .add("hash link", function() {
        result = isApplicationLink("#top");
    })

    .add("fully qualified link", function() {
        result = isApplicationLink("http://www.somewhere.com");
    })

    .add("absolute link", function() {
        result = isApplicationLink("/absolute/path");
    })

    .add("mailto link", function() {
        result = isApplicationLink("mailto:someone@example.com");
    })

    .add("javascript code link", function() {
        result = isApplicationLink("javascript:{}");
    })

    .add("application link", function() {
        result = isApplicationLink("application/link");
    })

    .on("cycle", function(event) {
        prettyOutput.add(event.target)
    })
    .on("complete", function() {
        prettyOutput.log();
    })
    .run();
