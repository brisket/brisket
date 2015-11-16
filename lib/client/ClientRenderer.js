"use strict";

var titleForRouteFrom = require("../util/titleForRouteFrom");

var ClientRenderer = {

    render: function(layout, view, requestId) {
        var shouldRenderTitle = requestId !== 1;

        if (shouldRenderTitle) {
            document.title = titleForRouteFrom(layout, view);
        }

        var shouldRenderMetaTags = requestId !== 1 && layout.updateMetatagsOnClientRender;

        if (shouldRenderMetaTags) {
            var metatags = view.getMetatags ? view.getMetatags() : null;
            layout.flushMetatags();
            layout.renderMetatags(metatags);
        }

        view.setUid(layout.generateChildUid(requestId));
        view.reattach();

        if (view.isAttached) {
            view.render();
            layout.setContentToAttachedView(view);
        }

        if (view.isNotAlreadyAttachedToDOM()) {
            layout.setContent(view);
        }

        return view;
    }

};

module.exports = ClientRenderer;

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
