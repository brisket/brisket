"use strict";

var spawn = require("child_process").spawn;

function configureGrunt(grunt) {

    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-benchmark");

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        benchmark: {
            all: {
                src: ["benchmarks/*.js"],
                dest: "benchmarks/results.json",
                format: "json"
            }
        },

        browserify: {
            test: {
                src: [
                    "lib/**/*.js",
                    "spec/helpers/**/*.js"
                ],
                dest: "spec/build/lib.js",
                options: {
                    alias: [
                        "node_modules/backbone/backbone.js:backbone",
                        "node_modules/lodash/lodash.js:lodash",
                        "node_modules/bluebird/js/main/bluebird.js:bluebird",
                        "node_modules/jquery/dist/jquery.js:jquery",
                        "node_modules/cookie/index.js:cookie"
                    ],
                    ignore: [
                        "lib/server/**/*.js"
                    ],
                    aliasMappings: [{
                        cwd: "lib/",
                        src: ["**/*.js"],
                        dest: "lib/"
                    }, {
                        cwd: "spec/mock/",
                        src: ["**/*.js"],
                        dest: "mock/"
                    }]
                }
            }
        },

        jasmine: {
            "test-on-client": {
                src: "spec/build/lib.js",
                options: {
                    specs: [
                        "spec/client/**/*.js"
                    ],
                    keepRunner: true,
                    display: "short",
                    summary: true
                }
            }
        },

        jshint: {
            files: [
                "lib/**/*.js",
                "spec/**/*.js",
                "!spec/build/*.js"
            ],
            options: {
                jshintrc: true
            }
        }

    });

    grunt.registerTask("jasmine-node:test-on-server", function() {
        var done = this.async();

        function abortOnError(exitCode) {
            if (exitCode) {
                grunt.fail.fatal("jasmine-node:test-on-server exited with exit code: " + exitCode);
            }

            done();
        }

        var command = "./node_modules/.bin/jasmine-node";

        var args = [
            "--matchAll",
            "spec/helpers/",
            "spec/server/"
        ];

        var options = {
            // Ignore stdin and stderr
            stdio: ["ignore", process.stdout, "ignore"]
        };

        spawn(command, args, options)
            .on("exit", abortOnError);
    });

    grunt.registerTask("test-on-client", [
        "browserify:test",
        "jasmine:test-on-client"
    ]);

    grunt.registerTask("test-on-server", [
        "jasmine-node:test-on-server"
    ]);

    grunt.registerTask("test", [
        "jshint",
        "test-on-server",
        "test-on-client"
    ]);

    grunt.registerTask("default", ["test"]);

}

module.exports = configureGrunt;

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
