"use strict";

var _ = require("underscore");
var Backbone = require("../application/Backbone");
var RenderableView = require("../traits/RenderableView");
var CloseableView = require("../traits/CloseableView");
var HasPageLevelData = require("../traits/HasPageLevelData");

function implementOnCloseMessage(view) {
    return "You did not implement onClose for the view " + view + ". " +
        "It has child views - you must clean it up by calling this.closeChildViews();";
}

var View = Backbone.View.extend(_.extend({},
    RenderableView,
    CloseableView,
    HasPageLevelData, {

        onClose: function() {
            if (this.hasChildViews()) {
                throw new Error(implementOnCloseMessage(this));
            }
        },

        toString: function() {
            var viewAsString = "Brisket.View: { " +
                "template: '" + this.template + "', " +
                "className: '" + this.className + "', " +
                "tagName: '" + this.tagName + "', " +
                "uid: '" + this.uid + "', " +
                "cid: '" + this.cid + "' " +
                "}";

            return viewAsString;
        }

    }

));

View.implementOnCloseMessage = implementOnCloseMessage;

module.exports = View;

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
