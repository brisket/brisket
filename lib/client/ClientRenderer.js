"use strict";

var titleForRouteFrom = require("../util/titleForRouteFrom");
var Metatags = require("../metatags/Metatags");

var ClientRenderer = {

    render: function(layout, view, requestId) {
        view.setUid(layout.generateChildUid(requestId));
        view.reattach();

        if (view.isAttached) {
            view.render();
            layout.setContentToAttachedView(view);
        }

        if (view.isNotAlreadyAttachedToDOM()) {
            layout.setContent(view);
        }

        updateTitle(layout, view, requestId);
        updateMetatags(layout, view, requestId);

        return view;
    }

};

function updateTitle(layout, view, requestId) {
    if (requestId === 1) {
        return;
    }

    document.title = titleForRouteFrom(layout, view);
}

function updateMetatags(layout, view, requestId) {
    var shouldRenderMetaTags = requestId !== 1 && layout.updateMetatagsOnClientRender;
    var metatags = typeof view.getMetatags === "function" ? view.getMetatags() : null;

    if (!metatags || !shouldRenderMetaTags) {
        return;
    }

    flushMetatags();
    renderMetatags(metatags);
}

function flushMetatags() {
    var head = document.head;
    var oldMetatags = head.querySelectorAll("[" + Metatags.IDENTIFIER + "]");

    for (var i = 0, len = oldMetatags.length; i < len; i++) {
        head.removeChild(oldMetatags[i]);
    }
}

function renderMetatags(metatagsFromRoute) {
    var metatags = metatagsFromRoute;

    if (!metatags) {
        return;
    }

    if (!Array.isArray(metatags)) {
        metatags = [metatags];
    }

    var head = document.head;
    var allMetatags = document.createDocumentFragment();

    for (var i = 0, len = metatags.length; i < len; i++) {
        allMetatags.appendChild(metatags[i].asTags());
    }

    head.appendChild(allMetatags);
}

module.exports = ClientRenderer;

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
