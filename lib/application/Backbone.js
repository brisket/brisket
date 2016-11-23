"use strict";

var Backbone = require("backbone").noConflict();
var $ = require("../application/jquery");
var Environment = require("../environment/Environment");

if (Environment.clientDebuggingEnabled() && window.__backboneAgent) {
    window.__backboneAgent.handleBackbone(Backbone);
}

if (Environment.isServer()) {
    var serverWindow = require("../server/serverWindow");

    Backbone.View.prototype._createElement = function(tagName) {
        return serverWindow.document.createElement(tagName);
    };
}

Backbone.$ = $;

module.exports = Backbone;

// ----------------------------------------------------------------------------
// Copyright (C) 2016 Bloomberg Finance L.P.
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
