"use strict";

var Promise = require("promise");

function promiseMethod(method) {
    return function() {
        var args = new Array(arguments.length);
        var context = this || null;

        for (var i = arguments.length - 1; i > -1; i--) {
            args[i] = arguments[i];
        }

        return Promise.resolve()
            .then(function() {
                return method.apply(context, args);
            });
    };
}

module.exports = promiseMethod;
