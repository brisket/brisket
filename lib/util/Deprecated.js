"use strict";

var Deprecated = {

    message: function(message, helpPage) {
        if (typeof console !== "undefined" && typeof console.warn === "function") {
            console.warn("[DEPRECATED] " + message + build(helpPage));
        }
    }

};

function build(helpPage) {
    if (!helpPage) {
        return "";
    }

    return ". Go to " + helpPage + " for full documentation.";
}

module.exports = Deprecated;
