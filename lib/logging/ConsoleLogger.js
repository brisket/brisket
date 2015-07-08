"use strict";

var NoopLogger = require("./NoopLogger");

var ConsoleLogger = {

    debug: function() {
        console.log.apply(this, arguments);
    },

    info: function() {
        console.info.apply(this, arguments);
    },

    warn: function() {
        console.warn.apply(this, arguments);
    },

    error: function() {
        console.error.apply(this, arguments);
    },

    fatal: function() {
        console.error.apply(this, arguments);
    }
};

module.exports = console ? ConsoleLogger : NoopLogger;
