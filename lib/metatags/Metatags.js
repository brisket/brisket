"use strict";

var _ = require("underscore");

var Metatags = function(pairs) {
    if (!pairs) {
        throw new Error("You cannot create empty metatags");
    }

    this.pairs = pairs;
};

Metatags.prototype = {

    pairs: null,

    toTags: function() {
        var tags = "";

        for (var key in this.pairs) {
            if (this.pairs.hasOwnProperty(key)) {

                switch (key) {
                    case "openGraph":
                        tags += openGraphTags(this.pairs[key]);
                        break;

                    default:
                        tags += standardMetaTag(key, this.pairs[key]);
                        break;
                }
            }
        }

        return tags;
    },

    get: function(tagName) {
        return this.pairs[tagName];
    }

};

function openGraphTags(pairs) {
    var tags = "";

    for (var key in pairs) {
        if (pairs.hasOwnProperty(key)) {
            tags += openGraphTag(key, pairs[key]);
        }
    }

    return tags;
}

function openGraphTag(key, value) {
    return metaTag("property", key, "content", value);
}

function standardMetaTag(key, value) {
    return metaTag("name", key, "content", value);
}

function metaTag(keyProp, key, valueProp, value) {
    if (!key || !value) {
        return "";
    }

    return "<meta " + keyProp + "=\"" + key + "\" " + valueProp + "=\"" + _.escape(value) + "\">";
}

module.exports = Metatags;

// ----------------------------------------------------------------------------
// Copyright (C) 2014 Bloomberg Finance L.P.
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
