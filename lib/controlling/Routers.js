"use strict";

function RoutersToUse(routersConfig) {
    routersConfig = routersConfig || {};

    this.CatchAllRouter = routersConfig.CatchAllRouter;
    this.routers = routersConfig.routers;
}

RoutersToUse.prototype = {

    CatchAllRouter: null,

    routers: null,

    init: function() {
        if (this.CatchAllRouter) {
            new this.CatchAllRouter();
        }

        for (var i = 0, len = this.routers.length; i < len; i++) {
            var Router = this.routers[i];
            new Router();
        }
    }

};

var Routers = {

    toUse: function(routersConfig) {
        return new RoutersToUse(routersConfig);
    }

};

module.exports = Routers;

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
