"use strict";

var NoopLogger = require("./NoopLogger");

var LOG_LEVELS = [
    "debug",
    "info",
    "warn",
    "error",
    "fatal"
];

var DEFAULT_LOG_LEVEL = LOG_LEVELS.indexOf("info");

var Logger = {
    loggerInterface: NoopLogger,
    logLevel: DEFAULT_LOG_LEVEL,

    use: function(logger) {
        Logger.loggerInterface = logger;
    },

    setLogLevel: function(level) {
        Logger.logLevel = LOG_LEVELS.indexOf(level);
    },

    write: function(level, msg) {
        if (LOG_LEVELS.indexOf(level) >= Logger.logLevel && Logger.loggerInterface[level]) {
            Logger.loggerInterface[level].apply(this, msg);
        }
    },

    debug: function() {
        Logger.write("debug", arguments);
    },

    info: function() {
        Logger.write("info", arguments);
    },

    warn: function() {
        Logger.write("warn", arguments);
    },

    error: function() {
        Logger.write("error", arguments);
    },

    fatal: function() {
        Logger.write("fatal", arguments);
    },

    log: function() {
        Logger.info.apply(this, arguments);
    }

};

module.exports = Logger;
