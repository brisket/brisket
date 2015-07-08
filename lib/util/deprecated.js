"use strict";

var Logger = require("../logging/Logger");

var deprecated = function(msg) {
    Logger.warn("[DEPRECATED] " + msg);
};

module.exports = deprecated;
