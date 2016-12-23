"use strict";

var _ = require("underscore");

function setKeys(obj, key, value) {
    var pairs = key;

    if (_.isString(pairs)) {
        pairs = {};
        pairs[key] = value;
    }

    _.assign(obj, pairs);
}

module.exports = setKeys;
