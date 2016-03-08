"use strict";

var ViewRelationship = require("../viewing/ViewRelationship");
var InstantiatedViewRelationship = require("../viewing/InstantiatedViewRelationship");

var HasChildViews = {

    hasBeenRendered: false,

    childViews: null,

    unrenderedChildViews: null,

    uidsCreated: 0,

    createChildView: function(optionalIdentifier, ChildView) {
        if (typeof optionalIdentifier != "string") {
            ChildView = optionalIdentifier;
        }

        var parentView = this;
        var viewRelationship = makeViewRelationship(ChildView, parentView);

        if (!this.hasChildViews()) {
            this.childViews = [];
        }

        addChildView(parentView, viewRelationship, optionalIdentifier);

        return viewRelationship;
    },

    replaceChildView: function(identifier, ChildView) {
        this.closeChildView(identifier);

        return this.createChildView(identifier, ChildView);
    },

    closeChildView: function(identifier) {
        if (!this.hasChildViews()) {
            return;
        }

        var viewRelationship = this.childViews[identifier];

        if (!viewRelationship) {
            return;
        }

        viewRelationship.close();
        this.removeUnrenderedChildView(viewRelationship);
        delete this.childViews[identifier];
    },

    closeChildViews: function() {
        if (!this.hasChildViews()) {
            return;
        }

        this.foreachChildView(function(viewRelationship) {
            viewRelationship.closeAsChild();
        });

        this.childViews = [];
        this.unrenderedChildViews = [];
    },

    foreachChildView: function(callback) {
        if (typeof callback !== "function" || !this.childViews) {
            return;
        }

        var identifiers = Object.keys(this.childViews);

        for (var i = 0, len = identifiers.length; i < len; i++) {
            var identifier = identifiers[i];
            var viewRelationship = this.childViews[identifier];

            callback.call(this, viewRelationship, identifier, i);
        }
    },

    addUnrenderedChildView: function(viewRelationship) {
        if (!this.unrenderedChildViews) {
            this.unrenderedChildViews = [];
        }

        this.unrenderedChildViews.push(viewRelationship);
    },

    removeUnrenderedChildView: function(viewRelationship) {
        var unrenderedChildViews = this.unrenderedChildViews;

        if (!viewRelationship || !unrenderedChildViews) {
            return;
        }

        for (var i = 0, len = unrenderedChildViews.length; i < len; i++) {
            if (unrenderedChildViews[i] === viewRelationship) {
                this.unrenderedChildViews.splice(i, 1);
                break;
            }
        }
    },

    childViewCount: function() {
        if (!this.childViews) {
            return 0;
        }

        return Object.keys(this.childViews).length;
    },

    unrenderedChildViewCount: function() {
        if (!this.unrenderedChildViews) {
            return 0;
        }

        return this.unrenderedChildViews.length;
    },

    hasChildViews: function() {
        return this.childViewCount() > 0;
    },

    hasNotBeenRendered: function() {
        return !this.hasBeenRendered;
    },

    generateChildUid: function(context) {
        this.uidsCreated = this.uidsCreated + 1;

        var contextId = context ? context + "|" : "";

        return contextId + this.uid + "_" + this.uidsCreated;
    }

};

function thereIsAlreadyAChildViewWith(optionalIdentifier, parentView) {
    return !!parentView.childViews[optionalIdentifier];
}

function addChildView(parentView, viewRelationship, optionalIdentifier) {
    if (typeof optionalIdentifier != "string") {
        parentView.childViews.push(viewRelationship);
        return;
    }

    if (!isNaN(parseInt(optionalIdentifier, 10))) {
        throw new Error(
            "For parentView " + parentView + ", you attempted to create a child view with a " +
            "number-like identifier '" + optionalIdentifier + "'. " +
            "A child view identifier cannot be 'number-like' due to crazy data structures"
        );
    }

    if (thereIsAlreadyAChildViewWith(optionalIdentifier, parentView)) {
        throw new Error(
            "For parentView " + parentView + ", you attempted to create a child view with " +
            "identifer '" + optionalIdentifier + "'. A child view exists with identifier '" +
            optionalIdentifier + "' already"
        );
    }

    parentView.childViews[optionalIdentifier] = viewRelationship;
}

function makeViewRelationship(ChildView, parentView) {
    if (!ChildView) {
        throw new Error(
            "You tried to create the child view '" + ChildView + "' for the parentView " + parentView + ".\n\n" +
            "To createChildView, pass a constructor or an instance of a Brisket.View"
        );
    }

    if (typeof ChildView == "function") { // cannot be an instantiated view
        return new ViewRelationship(ChildView, parentView);
    }

    return new InstantiatedViewRelationship(ChildView, parentView);
}

module.exports = HasChildViews;

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
