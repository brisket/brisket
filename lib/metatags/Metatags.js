"use strict";

var CustomTags = require("./CustomTags");

function createOpenGraphTag(property, content) {
    deprecated("Creating opengraph tags through Metatags has been deprecated. Please use new OpenGraphTags()");
    return '<meta property="' + property + '" content="' + content + '" data-ephemeral="true">';
}

function createLinkTag(rel, href) {
    deprecated("Creating canonical tags through Metatags has been deprecated. Please use new LinkTags()");
    return '<link rel="' + rel + '" href="' + href + '" data-ephemeral="true">';
}

function createNormalTag(name, content) {
    return '<meta name="' + name + '" content="' + content + '" data-ephemeral="true">';
}

function deprecated(msg) {
    if (typeof console !== "undefined" && typeof console.warn === "function") {
        console.warn("[DEPRECATED] " + msg);
    }
}

var Metatags = CustomTags.extend({
    template: function(name, value) {
        if (/^og\:/.test(name)) {
            return createOpenGraphTag(name, value);
        }

        if (name === "canonical") {
            return createLinkTag(name, value);
        }

        return createNormalTag(name, value);
    }
});

module.exports = Metatags;

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
