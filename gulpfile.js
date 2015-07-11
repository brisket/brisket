"use strict";

var gulp = require("gulp");
var beautifyJs = require("./build/beautifyJs");
var lintJs = require("./build/lintJs");
var bundle = require("./build/bundle");
var sequence = require("./build/sequence");
var clientSideJasmine = require("./build/clientSideJasmine");
var serverSideJasmine = require("./build/serverSideJasmine");

var LIB = "./lib/**/*.js";
var REST = "./*.js";
var BUILD = "./build/**/*.js";
var TEST_HELPERS = "./spec/helpers/**/*.js";
var CLIENT_TESTS = "./spec/client/**/*.js";
var CLIENT_TEST_BUNDLE = "./built_stuff/lib.js";
var CONFIGURE_CLIENT_TEST = "./spec/configureClientTesting.js";
var SERVER_TESTS = "./spec/server/**/*.js";
var CONFIGURE_SERVER_TEST = "./spec/configureServerTesting.js";
var ALL_TEST_CODE = "./spec/**/*.js";

var ALL_CODE = [
    BUILD,
    LIB,
    REST,
    ALL_TEST_CODE
];

gulp.task("beautifyJs", function() {
    return beautifyJs(ALL_CODE);
});

gulp.task("lintJs", function() {
    return lintJs(ALL_CODE);
});

gulp.task("test-on-server", function() {
    return serverSideJasmine([
        CONFIGURE_SERVER_TEST,
        TEST_HELPERS,
        SERVER_TESTS
    ]);
});

gulp.task("bundle-for-client", function() {
    return bundle({
        src: LIB,
        dest: CLIENT_TEST_BUNDLE,
        alias: {
            "backbone": "./node_modules/backbone/backbone.js",
            "lodash": "./node_modules/lodash/lodash.js",
            "bluebird": "./node_modules/bluebird/js/main/bluebird.js",
            "jquery": "./node_modules/jquery/dist/jquery.js",
            "cookie": "./node_modules/cookie/index.js"
        },
        mapDirectories: {
            "lib": "./lib",
            "mock": "./spec/mock"
        },
        ignore: "./lib/server/**/*.js"
    });
});

gulp.task("test-on-client", ["bundle-for-client"], function() {
    return clientSideJasmine({
        src: CLIENT_TEST_BUNDLE,
        specs: [
            CONFIGURE_CLIENT_TEST,
            TEST_HELPERS,
            CLIENT_TESTS
        ],
        vendor: "vendor/es5-shim.js"
    });
});

gulp.task("default", sequence(
    "beautifyJs", [
        "lintJs",
        "test-on-server",
        "test-on-client"
    ]
));

// ----------------------------------------------------------------------------
// Copyright (C) 2015 Bloomberg Finance L.P.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------- END-OF-FILE ----------------------------------
