"use strict";

function titleForRouteFrom(layout, view) {
    var titleForRoute = view.getTitle ? view.getTitle() : null;

    return titleForRoute || layout.defaultTitle;
}

module.exports = titleForRouteFrom;
