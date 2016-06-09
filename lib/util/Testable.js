"use strict";

var request = require("request");
var Promise = require("promise/domains");

var Testable = {

    request: request,

    // wawjr3d 5/31/2016 TODO adding multiArgs to support bluebird 2.
    //  Remove second parameter and update all uses of requestPromise
    //  when support for bluebird 3 is dropped
    requestPromise: Promise.denodeify(request)

};

module.exports = Testable;
