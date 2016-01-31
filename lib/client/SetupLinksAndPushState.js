"use strict";

var Backbone = require("../application/Backbone");
var Url = require("../util/Url");
var ClientRequest = require("../client/ClientRequest");
var isApplicationLink = require("../controlling/isApplicationLink");
var isExternalLinkTarget = require("../controlling/isExternalLinkTarget");

function isNotUsabilityClick(e) {
    /* wawjr3d
     * Ignore ctrl+click, alt+click, shift+click, meta+click
     * Ignore Firefox bubbles non-left button clicks (i.e. e.button > 0)
     */
    return !e.button && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;
}

function notLink(eventTarget) {
    return !eventTarget || eventTarget.nodeName !== "A" || !eventTarget.hasAttribute("href");
}

function routeApplicationLink(e) {
    var eventTarget = e.target;

    if (notLink(eventTarget)) {
        return;
    }

    var link = eventTarget;
    var route = link.getAttribute("href");
    var target = link.getAttribute("target");

    if (!e.defaultPrevented &&
        !isExternalLinkTarget(target) &&
        isApplicationLink(route) &&
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
    document.addEventListener("click", routeApplicationLink);
}

function finishStartWithPushState() {
    setupApplicationLinks();
    Backbone.history.loadUrl(Backbone.history.getFragment());
}

function invalid(route) {
    return typeof route !== "string";
}

function finishStartWithoutPushState(root) {
    return function() {
        var rootLength = root.length;
        var fragment = Url.location().pathname.substr(rootLength);
        Backbone.history.loadUrl(fragment);
    };
}

var browserSupportsPushState = true;
var root = "";

var SetupLinksAndPushState = {

    start: function(requestedOptions) {
        var options = requestedOptions || {};

        if ("root" in options) {
            root = options.root;
        }

        if ("browserSupportsPushState" in options) {
            browserSupportsPushState = options.browserSupportsPushState;
        }

        Backbone.history.start({
            pushState: browserSupportsPushState,
            root: root,
            hashChange: false,
            silent: true
        });

        var finishStart = browserSupportsPushState ?
            finishStartWithPushState : finishStartWithoutPushState(root);

        finishStart();
    },

    stop: function() {
        Backbone.history.stop();
        document.removeEventListener("click", routeApplicationLink);
    },

    navigateTo: function(route) {
        if (invalid(route)) {
            return;
        }

        Backbone.history.navigate(route, {
            trigger: true
        });
    },

    replacePath: function(route) {
        if (!browserSupportsPushState || invalid(route)) {
            return;
        }

        Backbone.history.navigate(route, {
            replace: true
        });
    },

    changePath: function(route) {
        if (!browserSupportsPushState || invalid(route)) {
            return;
        }

        Backbone.history.navigate(route);
    },

    reloadRoute: function() {
        Backbone.history.loadUrl();
    }

};

module.exports = SetupLinksAndPushState;

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
