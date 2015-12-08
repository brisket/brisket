"use strict";

var noop = require("../util/noop");

var isServer = typeof window == "undefined";

var Environment = {

    isServer: function() {
        return isServer;
    },

    isClient: function() {
        return !this.isServer();
    },

    clientDebuggingEnabled: function() {
        return !!(Environment.isClient() && window.Brisket && window.Brisket.debug === true);
    },

    onlyRunsOnClient: function(method) {
        if (Environment.isServer()) {
            return noop;
        }

        return method;
    }

};

module.exports = Environment;

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
