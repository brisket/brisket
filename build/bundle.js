"use strict";

var gulp = require("gulp");
var glob = require("glob");
var browserify = require("browserify");
var source = require("vinyl-source-stream");

function bundle(options) {
    var src = options.src || [];
    var dest = options.dest;
    var ignore = options.ignore || [];
    var alias = options.alias || {};
    var mapDirectories = options.mapDirectories || {};

    var toBundle = glob.sync(src);
    var toIgnore = glob.sync(ignore);

    var bundler = browserify({
        entries: toBundle
    });

    toIgnore.forEach(function(ignoreFile) {
        bundler.ignore(ignoreFile);
    });

    Object.keys(alias).forEach(function(newName) {
        var toAlias = alias[newName];

        bundler.require(toAlias, {
            expose: newName
        });
    });

    Object.keys(mapDirectories).forEach(function(newName) {
        var directory = mapDirectories[newName];
        var toMap = directory + "/**/*.js";
        var matchedFiles = glob.sync(toMap);

        matchedFiles.forEach(function(filePath) {
            var scriptName = filePath.split(directory)[1];
            scriptName = scriptName.substr(0, scriptName.length - 3);

            bundler.require(filePath, {
                expose: newName + scriptName
            });
        });
    });

    return bundler.bundle()
        .pipe(source(dest))
        .pipe(gulp.dest("."));
}

module.exports = bundle;

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
