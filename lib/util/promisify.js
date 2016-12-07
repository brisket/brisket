"use strict";

function promisifyMaker(Promise) {
    return function promisify(method) {
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
    };
}

module.exports = promisifyMaker;
