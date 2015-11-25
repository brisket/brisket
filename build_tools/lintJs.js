"use strict";

var gulp = require("gulp");
var jshint = require("gulp-jshint");
var stylish = require("jshint-stylish");
var jshintConfig = require("./config/jshintrc.json");

function lintJs(what) {
    return gulp.src(what)
        .pipe(jshint(jshintConfig))
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter("fail"));
}

module.exports = lintJs;

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
