"use strict";

var _ = require("lodash");
var $ = require("../application/jquery");
var View = require("../viewing/View");
var Environment = require("../environment/Environment");
var Metatags = require("../metatags/Metatags");
var noop = require("../util/noop");

var FIND_DOCTYPE = /<!doctype[^>]*>/i;

var Layout = View.extend({

    uid: "0",

    isAttached: true,

    defaultTitle: "",
    currentTitle: null,

    metatags: null,

    renderedMetatags: null,

    content: null,

    environmentConfig: null,

    updateMetatagsOnClientRender: false,

    $head: function() {
        return this.$("head");
    },

    $body: function() {
        return this.$("body");
    },

    $title: function() {
        return this.$("title");
    },

    fetchData: noop,

    isSameTypeAs: function(LayoutType) {
        return this.constructor === LayoutType;
    },

    isSameAs: function(layout) {
        return this.constructor === layout.constructor;
    },

    reattach: function() {
        this.setElement($("html").get(0));
    },

    setTitle: function(title) {
        this.currentTitle = title;
    },

    setMetaTags: function(metatags) {
        if (!metatags) {
            return;
        }

        this.metatags = metatags;
    },

    setEnvironmentConfig: function(environmentConfig) {
        this.environmentConfig = environmentConfig;
    },

    backToNormal: noop,

    asHtml: function() {
        var html = this.el.innerHTML;
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

    renderPageTitle: function() {
        var title = this.currentTitle || this.defaultTitle;

        this.$title().text(title);

        this.setTitle(null);
    },

    renderMetaTags: function() {
        var metatags = this.metatags;
        var renderedMetatags = this.renderedMetatags;

        if (!metatags || metatags.sameAs(renderedMetatags)) {
            return;
        }

        if (renderedMetatags) {
            renderedMetatags.closeTagViews();
        }

        _.each(metatags.createTagViews(), function(tagView) {
            this.createChildView(tagView)
                .andAppendItTo("head");
        }.bind(this));

        this.renderedMetatags = metatags;
    },

    renderPageLevelData: function(shouldRenderMetaTags) {
        this.renderPageTitle();

        if (shouldRenderMetaTags) {
            this.renderMetaTags();
        }
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
