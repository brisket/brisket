"use strict";

var ClientRenderer = {

    render: function(layout, shouldInitializeLayout, view, onRender, requestId) {
        layout.setExtraRenderInstructions(function(layout) {
            layout.backToNormal();
            onRender(layout);
        });

        if (shouldInitializeLayout) {
            layout.reattach();
            layout.render();
            layout.enterDOM();
        }

        var title = view.getTitle ? view.getTitle() : null;
        layout.setTitle(title);
        layout.renderPageTitle();

        view.setUid(layout.generateChildUid(requestId));
        view.reattach();

        if (view.isAttached) {
            view.render();
            layout.setContentToAttachedView(view);
        }

        if (view.isNotAlreadyAttachedToDOM()) {
            layout.setContent(view);
        }

        view.enterDOM();
    }

};

module.exports = ClientRenderer;

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
