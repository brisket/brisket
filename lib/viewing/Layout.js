"use strict";

var $ = require("../application/jquery");
var View = require("../viewing/View");
var Environment = require("../environment/Environment");
var Metatags = require("../metatags/Metatags");
var noop = require("../util/noop");

var FIND_HTML_TAG_ATTRIBUTES = /<html ([^>]*)>/i;
var FIND_DOCTYPE = /^\s*<!doctype[^>]*>/i;
var FIND_HTML_TAG = /^\s*<html/i;

var Layout = View.extend({

    uid: "0",

    tagName: Environment.isServer() ? "html" : "div",

    isAttached: true,

    defaultTitle: "",

    content: null,

    environmentConfig: null,

    updateMetatagsOnClientRender: false,

    fetchData: noop,

    $head: function() {
        return this.$("head");
    },

    $body: function() {
        return this.$("body");
    },

    $title: function() {
        return this.$("title");
    },

    isSameTypeAs: function(LayoutType) {
        return this.constructor === LayoutType;
    },

    isSameAs: function(layout) {
        return this.constructor === layout.constructor;
    },

    reattach: function() {
        this.setElement($("html").eq(0));
    },

    setEnvironmentConfig: function(environmentConfig) {
        this.environmentConfig = environmentConfig;
    },

    backToNormal: noop,

    asHtml: function() {
        var html = this.tagName === "html" ? this.el.outerHTML : this.el.innerHTML;
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

    hideContent: function() {
        this.$(this.content).children().eq(0).hide();
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
    },

    renderTitle: function(title) {
        if (!title) {
            this.$title().text(this.defaultTitle);
            return;
        }

        this.$title().text(title);
    },

    flushMetatags: function() {
        this.$head().find('*[data-ephemeral="true"]').remove();
    },

    renderMetatags: function(metatags) {
        if (!metatags || !metatags.html) {
            return;
        }

        this.$head().append(metatags.html);
    },

    render: function() {
        this.establishIdentity();

        this.beforeRender();

        if (Environment.isServer()) {
            this.renderTemplate();
            this.renderUnrenderedChildViews();
        }

        if (Environment.isClient()) {
            this.reattachUnrenderedChildViews();
        }

        this.hasBeenRendered = true;

        this.afterRender();

        return this;
    }

});

function parseHtmlTagAttributesFromRawRenderedHTML(rawRenderedHTML) {
    var matches = FIND_HTML_TAG_ATTRIBUTES.exec(rawRenderedHTML);

    return matches ? matches[1] : null;
}

function parseDoctypeFromRawRenderedHTML(rawRenderedHTML) {
    return FIND_DOCTYPE.exec(rawRenderedHTML);
}

Layout.Metatags = Metatags;

module.exports = Layout;

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
