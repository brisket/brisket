"use strict";

var ViewRelationship = require("./ViewRelationship");

function InstantiatedViewRelationship(childView, parentView) {
    this.childView = childView;
    this.parentView = parentView;
}

InstantiatedViewRelationship.prototype = Object.create(ViewRelationship.prototype);

InstantiatedViewRelationship.prototype.withOptions = function() {
    throw new Error(
        "You attempted to call withOptions on a child view that has already been instantiated - " +
        this.childView + ". The parentView was " + this.parentView + "\n" +
        "You cannot use .withOptions when you .createChildView with " +
        "an instantiated view. For example:" +
        "\n\n" +
        "    var childView = new Brisket.View();" +
        "\n\n" +
        "    parentView.createChildView(childView).withOptions({ some: 'option' });" +
        "\n\n" +
        "is not allowed. Your childView should be already populated with the " +
        "options that it needs before you pass it to .createChildView"
    );
};

module.exports = InstantiatedViewRelationship;

// ----------------------------------------------------------------------------
// Copyright (C) 2018 Bloomberg Finance L.P.
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
