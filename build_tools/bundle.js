"use strict";

var gulp = require("gulp");
var glob = require("glob");
var browserify = require("browserify");
var source = require("vinyl-source-stream");

function bundle(options) {
    var settings = options || {};
    var src = settings.src;
    var dest = settings.dest;
    var ignore = settings.ignore;
    var alias = settings.alias || {};
    var mapDirectories = settings.mapDirectories || {};
    var shouldDebug = !!settings.debug;

    var toBundle = files(src);

    var bundler = browserify({
        entries: toBundle
    }, {
        debug: shouldDebug
    });

    ignoreModules(ignore, bundler);

    aliasModules(alias, bundler);

    aliasDirectories(mapDirectories, bundler);

    return bundler.bundle()
        .pipe(source(dest))
        .pipe(gulp.dest("."));
}

function ignoreModules(ignore, bundler) {
    if (!ignore || !ignore.length) {
        return;
    }

    var toIgnore = files(ignore);

    toIgnore.forEach(function(ignoreFile) {
        bundler.ignore(ignoreFile);
    });
}

function aliasModules(alias, bundler) {
    Object.keys(alias).forEach(function(newName) {
        var toAlias = alias[newName];

        bundler.require(toAlias, {
            expose: newName
        });
    });
}

function aliasDirectories(mapDirectories, bundler) {
    Object.keys(mapDirectories).forEach(function(newName) {
        var directory = mapDirectories[newName];
        var toMap = directory + "/**/*.js";
        var matchedFiles = files(toMap);

        matchedFiles.forEach(function(filePath) {
            var scriptName = filePath.split(directory)[1];
            scriptName = scriptName.substr(0, scriptName.length - 3);

            bundler.require(filePath, {
                expose: newName + scriptName
            });
        });
    });
}

function files(patterns) {
    if (!Array.isArray(patterns)) {
        return glob.sync(patterns);
    }

    var fileGroups = patterns.map(function(pattern) {
        return glob.sync(pattern);
    });

    return Array.prototype.concat.apply([], fileGroups);
}

module.exports = bundle;

// ----------------------------------------------------------------------------
// Copyright (C) 2016 Bloomberg Finance L.P.
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
