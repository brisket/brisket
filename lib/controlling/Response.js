"use strict";

var Backbone = require("../application/Backbone");
var noop = require("../util/noop");
var isApplicationLink = require("../controlling/isApplicationLink");

var DEFAULT_REDIRECT_APP_ROOT = "";

function Response() {
    return this.initialize.apply(this, arguments);
}

Response.prototype = {

    initialize: noop,

    status: noop,

    set: noop,

    redirect: noop

};

Response.INTERRUPT_RENDERING = {};
Response.DEFAULT_REDIRECT_APP_ROOT = "/";
Response.appRootForRedirect = DEFAULT_REDIRECT_APP_ROOT;

Response.setAppRoot = function(appRoot) {
    Response.appRootForRedirect = appRoot ? appRoot : DEFAULT_REDIRECT_APP_ROOT;
};

Response.redirectDestinationFrom = function(destination) {
    if (isApplicationLink(destination)) {
        return Response.appRootForRedirect + "/" + destination;
    }

    return destination;
};

Response.extend = Backbone.Model.extend;

module.exports = Response;

// ----------------------------------------------------------------------------
// Copyright (C) 2018 Bloomberg Finance L.P.
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
