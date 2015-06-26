"use strict";

var _ = require("lodash");
var Environment = require("../environment/Environment");
var Backbone = require("../application/Backbone");
var noop = require("../util/noop");

var ServerEvents = _.extend({},
    Backbone.Events, {
        on: noop,
        off: noop,
        trigger: noop,
        once: noop,
        listenTo: noop,
        stopListening: noop,
        listenToOnce: noop
    }
);

var Events = Environment.isServer() ? ServerEvents : Backbone.Events;

module.exports = Events;

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
