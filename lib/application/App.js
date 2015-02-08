"use strict";

var Configure = require("./Configure");
var Backbone = require("backbone");
var Syncing = require("../modeling/Syncing");
var noop = require("../util/noop");
var catchAjaxCallbackExceptions = require("../util/catchAjaxCallbackExceptions");

var App = function() {
    return this.initialize.apply(this, arguments);
};

App.prototype = {

    initialize: noop,

    navigate: noop,

    routers: null,

    start: function() {
        var routers = this.routers;

        Configure.backbone();

        Syncing.beforeSync(catchAjaxCallbackExceptions);

        if (routers && routers.init) {
            routers.init();
        }
    }

};

App.extend = function(protoProps, staticProps) {
    var props = protoProps || {};
    var originalStart = props.start || noop;

    if (typeof originalStart !== "function") {
        throw new Error("An App's 'start' property can only be defined as a function");
    }

    var parentStart = this.prototype.start;

    props.start = function() {
        parentStart.apply(this, arguments);
        originalStart.apply(this, arguments);
    };

    return Backbone.History.extend.call(this, props, staticProps);
};

module.exports = App;

// ----------------------------------------------------------------------------
// Copyright (C) 2015 Bloomberg Finance L.P.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------- END-OF-FILE ----------------------------------
