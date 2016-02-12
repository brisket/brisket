"use strict";

var noop = require("../util/noop");
var Environment = require("../environment/Environment");

var CloseableView = {

    onClose: noop,

    close: function() {
        var onCloseError;

        this.trigger("close");

        onCloseError = ifOnCloseError(this);

        this.unbind();
        this.remove();

        if (onCloseError) {
            throw onCloseError;
        }
    },

    closeAsChild: function() {
        var onCloseError;

        this.trigger("close");

        onCloseError = ifOnCloseError(this);

        this.unbind();

        if (Environment.isServer()) {
            this.remove();
        }

        if (Environment.isClient()) {
            this.stopListening();
            this.$el.off();
            this.$el.removeData();
        }

        if (onCloseError) {
            throw onCloseError;
        }
    }

};

function ifOnCloseError(view) {
    try {
        view.onClose();

        if (typeof view.hasChildViews === "function" && view.hasChildViews()) {
            view.closeChildViews();
        }
    } catch (e) {
        console.error(
            "Error: There is an error in an onClose callback.\n" +
            "View with broken onClose is: " + view
        );

        return e;
    }

    return null;
}

module.exports = CloseableView;

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
