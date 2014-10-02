"use strict";

var configureGrunt = function(grunt) {

    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-contrib-jasmine");
    grunt.loadNpmTasks("grunt-jasmine-node");

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        jshint: {
            files: [
                "lib/**/*.js",
                "spec/**/*.js",
                "!spec/build/*.js"
            ],
            options: {
                jshintrc: true
            }
        },

        browserify: {

            test: {

                src: [
                    "lib/**/*.js"
                ],
                dest: "spec/build/lib.js",
                options: {
                    alias: [
                        "node_modules/backbone/backbone.js:backbone",
                        "node_modules/underscore/underscore.js:underscore",
                        "node_modules/bluebird/zalgo.js:bluebird",
                        "node_modules/jquery/dist/jquery.js:jquery"
                    ],
                    ignore: [
                        "lib/server/**/*.js",
                        "lib/brisket.js"
                    ],
                    aliasMappings: [
                        {
                            cwd: "lib/",
                            src: ["**/*.js"],
                            dest: "lib/"
                        }
                    ],
                    shim: {
                        "jquery-mockjax": {
                            path: "node_modules/jquery-mockjax/jquery.mockjax.js",
                            exports: null,
                            depends: {
                                jquery: "jQuery"
                            }
                        }
                    }
                }

            }

        },

        jasmine_node: {
            options: {
                forceExit: true,
                useHelpers: true,
                specNameMatcher: "Spec",
                helperNameMatcher: "helper",
            },
            all: [
                "spec/server",
                "spec/helpers"
            ]
        },

        jasmine: {
            "test-lib": {
                src: "spec/build/lib.js",
                options: {
                    specs: [
                        "spec/client/**/*.js",
                    ],
                    helpers: [
                        "spec/helpers/**/*.js"
                    ],
                    template: "spec/customTemplate/helpersAfterSrcRunner.tmpl",
                    keepRunner: true
                }
            }
        }

    });

    grunt.registerTask("test", [
        "jshint",
        "browserify:test",
        "jasmine",
        "jasmine_node"
    ]);

    grunt.registerTask("default", ["test"]);

};

module.exports = configureGrunt;

// ----------------------------------------------------------------------------
// Copyright (C) 2014 Bloomberg L.P.
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
