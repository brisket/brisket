"use strict";

var $ = require("../application/jquery");
var Backbone = require("../application/Backbone");
var Url = require("../util/Url");
var ClientRequest = require("../client/ClientRequest");

var NON_APPLICATION_LINK_PATTERNS = [
    /^[#]/,
    /^http/,
    /^\//,
    /^mailto/,
    /^javascript:.*/
];

function isNotIgnoredLink(link) {
    return !NON_APPLICATION_LINK_PATTERNS.some(function(linkPattern) {
        return linkPattern.test(link);
    });
}

function isNotUsabilityClick(e) { // Allow shift+click for new tabs, etc.
    return !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;
}

function routeApplicationLink(e) {
    var $link = $(e.currentTarget);
    var route = $link.attr("href");

    if (!e.isDefaultPrevented() &&
        isNotIgnoredLink(route) &&
        isNotUsabilityClick(e)) {

        e.preventDefault();

        ClientRequest.isFromLinkClick();

        // Instruct Backbone to trigger routing events
        Backbone.history.navigate(route, {
            trigger: true
        });

        return false;
    }
}

function setupApplicationLinks() {
    $(document).on("click", "a[href]", routeApplicationLink);
}

function finishStartWithPushState() {
    setupApplicationLinks();
    Backbone.history.loadUrl(Backbone.history.getFragment());
}

var finishStartWithoutPushState = function(root) {
    return function() {
        var rootLength = root.length;
        var fragment = Url.location().pathname.substr(rootLength);
        Backbone.history.loadUrl(fragment);
    };
};

var DEFAULTS = {
    root: "",
    pushState: true
};

var SetupLinksAndPushState = {

    start: function(options) {
        options = $.extend({}, DEFAULTS, options);

        Backbone.history.start({
            pushState: options.pushState,
            root: options.root,
            silent: true
        });

        var finishStart = options.pushState ?
            finishStartWithPushState : finishStartWithoutPushState(options.root);

        finishStart();
    },

    stop: function() {
        Backbone.history.stop();
        $(document).off("click", "a[href]", routeApplicationLink);
    }

};

module.exports = SetupLinksAndPushState;

// ----------------------------------------------------------------------------
// Copyright (C) 2014 Bloomberg L.P.
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
