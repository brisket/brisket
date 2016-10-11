"use strict";

var REDIRECT_ON_NEW_LAYOUT_PROPERTY = "brisket:layoutRedirect";

var RedirectOnNewLayout = {

    letClientKnowIfShould: function(environmentConfig, redirectOnNewLayout) {
        environmentConfig[REDIRECT_ON_NEW_LAYOUT_PROPERTY] = !!redirectOnNewLayout;
    },

    should: function(environmentConfig) {
        return environmentConfig[REDIRECT_ON_NEW_LAYOUT_PROPERTY] === true;
    }

};

module.exports = RedirectOnNewLayout;
