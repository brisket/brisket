"use strict";

var View = require("../viewing/View");
var noop = require("../util/noop");

var FIND_HTML_TAG_ATTRIBUTES = /<html ([^>]*)>/i;
var FIND_DOCTYPE = /^\s*<!doctype[^>]*>/i;
var FIND_HTML_TAG = /^\s*<html/i;

var Layout = View.extend({

    uid: "0",

    tagName: "html",

    content: null,

    fetchData: noop,

    backToNormal: noop,

    isSameTypeAs: function(LayoutType) {
        return this.constructor === LayoutType;
    },

    reattach: function() {
        this.setElement(document.documentElement);
        this.isAttached = true;
    },

    asHtml: function() {
        var html = this.el.outerHTML;
        var htmlTagAttributes = parseHtmlTagAttributesFromRawRenderedHTML(this.rawRenderedHTML);

        if (htmlTagAttributes) {
            html = html.replace(FIND_HTML_TAG, "<html " + htmlTagAttributes);
        }

        var doctype = parseDoctypeFromRawRenderedHTML(this.rawRenderedHTML);

        if (doctype) {
            html = doctype + "\n" + html;
        }

        return html;
    },

    setContent: function(view) {
        this.replaceChildView("content", view)
            .andInsertInto(this.content);
    },

    setContentToAttachedView: function(view) {
        this.createChildView("content", view);
    },

    clearContent: function() {
        this.closeChildView("content");
    }

});

function parseHtmlTagAttributesFromRawRenderedHTML(rawRenderedHTML) {
    var matches = FIND_HTML_TAG_ATTRIBUTES.exec(rawRenderedHTML);

    return matches ? matches[1] : null;
}

function parseDoctypeFromRawRenderedHTML(rawRenderedHTML) {
    return FIND_DOCTYPE.exec(rawRenderedHTML);
}

module.exports = Layout;

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
