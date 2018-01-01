"use strict";

var IDENTIFIER = "data-ephemeral";

var NORMAL_TAG = {
    tag: "meta",
    name: "name",
    content: "content"
};

var OPEN_GRAPH_TAG = {
    tag: "meta",
    name: "property",
    content: "content"
};

var LINK_TAG = {
    tag: "link",
    name: "rel",
    content: "href"
};

function IDENTITY(me) {
    return me;
}

function asHtml(type, name, content) {
    return "<" + type.tag + " " +
        type.name + "=\"" + name + "\" " +
        type.content + "=\"" + content + "\" " +
        IDENTIFIER + "=\"true\">";
}

function asTag(type, name, content) {
    var tag = document.createElement(type.tag);
    tag.setAttribute(type.name, name);
    tag.setAttribute(type.content, content);
    tag.setAttribute(IDENTIFIER, true);

    return tag;
}

function BaseMetatags(pairs) {
    if (!pairs) {
        throw new Error("You must provide name-content pairs when creating Metatags");
    }

    this.pairs = pairs;
}

BaseMetatags.prototype = {

    pairs: null,

    type: null,

    // wawjr3d pass in escape strategy so client doesn't need to bundle escape-html
    asHtml: function(escape) {
        var pairs = this.pairs;
        var type = this.type;
        var names = Object.keys(pairs);
        var html = "";
        var escapeHtml = escape || IDENTITY;
        var name;
        var computedType;

        for (var i = 0, len = names.length; i < len; i++) {
            name = names[i];
            computedType = typeof type === "function" ? type(name) : type;

            html += asHtml(computedType, name, escapeHtml(pairs[name]));
        }

        return html;
    },

    asTags: function() {
        var pairs = this.pairs;
        var type = this.type;
        var names = Object.keys(pairs);
        var fragment = document.createDocumentFragment();
        var name;
        var computedType;

        for (var i = 0, len = names.length; i < len; i++) {
            name = names[i];
            computedType = typeof type === "function" ? type(name) : type;

            fragment.appendChild(asTag(computedType, name, pairs[name]));
        }

        return fragment;
    }

};

BaseMetatags.extend = function(type) {
    function MetatagsChild() {
        BaseMetatags.apply(this, arguments);
    }

    MetatagsChild.prototype = Object.create(BaseMetatags.prototype);
    MetatagsChild.prototype.type = type;

    return MetatagsChild;
};

var NormalTags = BaseMetatags.extend(function(name) {
    if (/^og\:/.test(name)) {
        return OPEN_GRAPH_TAG;
    }

    if (name === "canonical") {
        return LINK_TAG;
    }

    return NORMAL_TAG;
});

var LinkTags = BaseMetatags.extend(LINK_TAG);
var OpenGraphTags = BaseMetatags.extend(OPEN_GRAPH_TAG);

var Metatags = {

    NormalTags: NormalTags,
    LinkTags: LinkTags,
    OpenGraphTags: OpenGraphTags,

    IDENTIFIER: IDENTIFIER

};

module.exports = Metatags;

// ----------------------------------------------------------------------------
// Copyright (C) 2018 Bloomberg Finance L.P.
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
