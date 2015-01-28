"use strict";

function createOpenGraphTag(property, content) {
    return '<meta property="' + property + '" content="' + content + '" data-ephemeral="true">';
}

function createNormalTag(name, content) {
    return '<meta name="' + name + '" content="' + content + '" data-ephemeral="true">';
}

function createLinkTag(rel, href) {
    return '<link rel="' + rel + '" href="' + href + '" data-ephemeral="true">';
}

function createTag(name, value) {
    if (/^og\:/.test(name)) {
        return createOpenGraphTag(name, value);
    }

    if (/^canonical$/.test(name)) {
        return createLinkTag(name, value);
    }

    return createNormalTag(name, value);
}

var Metatags = function(pairs) {
    if (!pairs) {
        throw new Error("You must provide name-content pairs when creating Metatags");
    }

    var html = "";

    Object.keys(pairs).forEach(function(name) {
        html += createTag(name, pairs[name]);
    });

    this.html = html;
};

Metatags.prototype = {
    html: null
};

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
