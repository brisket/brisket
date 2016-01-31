"use strict";

function ErrorViews(mapping) {
    if (!("500" in mapping)) {
        throw new Error("You must specify a 500 error view");
    }

    this.UnhandledErrorView = mapping["500"];

    this.mapping = mapping;
}

ErrorViews.prototype = {

    mapping: null,

    UnhandledErrorView: null,

    viewFor: function(statusCode) {
        var ErrorView = this.mapping[statusCode];

        if (!ErrorView) {
            return this.UnhandledErrorView;
        }

        return ErrorView;
    },

    getStatus: function(statusCode) {
        if (!!this.mapping[statusCode]) {
            return statusCode;
        }

        return 500;
    }
};

module.exports = ErrorViews;

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
