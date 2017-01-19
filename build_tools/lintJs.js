"use strict";

var gulp = require("gulp");
var eslint = require("gulp-eslint");
var gulpif = require("gulp-if");
var path = require("path");

function lintJs(options) {
    var settings = options || {};

    return gulp.src(settings.what)
        .pipe(eslint({
            fix: !!settings.fix,
            configFile: path.join(__dirname, "config/eslintrc.json")
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
        .pipe(gulpif(isFixed, gulp.dest(function(file) {
            return file.base;
        })));
}

function isFixed(file) {
    return file.eslint && file.eslint.fixed;
}

module.exports = lintJs;

// ----------------------------------------------------------------------------
// Copyright (C) 2017 Bloomberg Finance L.P.
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
