"use strict";

var gulp = require("gulp");
var jasmine = require("gulp-jasmine-phantom");

function clientSideJasmine(config) {
    var specs = config.specs;
    var src = config.src || [];
    var vendor = config.vendor || [];
    var vendorFiles = [].concat(src, vendor);
    var options = {
        integration: true,
        keepRunner: "./",
        vendor: vendorFiles,
        abortOnFail: true
    };

    return gulp.src(specs)
        .pipe(jasmine(options));
}

module.exports = clientSideJasmine;

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
