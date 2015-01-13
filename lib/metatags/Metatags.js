"use strict";

var OpenGraphTag = require("./OpenGraphTag");
var LinkTag = require("./LinkTag");
var StandardTag = require("./StandardTag");
var _ = require("underscore");

var Metatags = function(pairs) {
    if (!pairs) {
        throw new Error("You cannot create empty metatags");
    }

    this.pairs = pairs;

    this.tagViews = [];
};

Metatags.prototype = {

    createTagView: function(tagName, tagValue) {
        if (/^og\:/.test(tagName)) {
            return OpenGraphTag.createView(tagName, tagValue);
        }

        if (/^canonical$/.test(tagName)) {
            return LinkTag.createView(tagName, tagValue);
        }

        return StandardTag.createView(tagName, tagValue);
    },

    createTagViews: function() {
        var pairs = this.pairs;

        for (var key in pairs) {
            if (pairs.hasOwnProperty(key)) {
                this.tagViews.push(this.createTagView(key, pairs[key]));
            }
        }

        return this.tagViews;
    },

    closeTagViews: function() {
        _.each(this.tagViews, function(tagView) {
            tagView.close();
        });

        this.tagViews = [];
    },

    sameAs: function(metatags) {
        if (metatags && _.isEqual(metatags.pairs, this.pairs)) {
            return true;
        }

        return false;
    }

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
