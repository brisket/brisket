"use strict";

var Promise = require("bluebird");
var request = require("request");

var Testable = {

    request: request,

    requestPromise: Promise.promisify(request)

};

module.exports = Testable;
