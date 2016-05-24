"use strict";

var ViewsFromServer = require("../viewing/ViewsFromServer");

var ReattachableView = {

    uid: null,

    isAttached: false,

    isNotAlreadyAttachedToDOM: function() {
        return !this.isAttached;
    },

    hasValidUid: function() {
        return typeof this.uid == "string" && this.uid.length > 0;
    },

    reattach: function() {
        if (!this.hasValidUid()) {
            return;
        }

        var viewElement = ViewsFromServer.getAndPurge(this.uid);

        if (!viewElement) {
            return;
        }

        this.setElement(viewElement);

        this.isAttached = true;
    },

    establishIdentity: function() {
        if (!this.hasValidUid()) {
            return;
        }

        this.el.setAttribute(ViewsFromServer.IDENTITY_ATTRIBUTE, this.uid);
    },

    setUid: function(uid) {
        this.uid = uid;
    }

};

module.exports = ReattachableView;

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
