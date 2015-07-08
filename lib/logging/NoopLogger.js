"use strict";

var noop = require("../util/noop");

var NoopLogger = {
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
    fatal: noop
};

module.exports = NoopLogger;
