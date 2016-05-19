"use strict";

var _ = require("underscore");
var Router = require("./Router");

var RouterBrewery = {

    create: createRouter,

    makeBreweryWithDefaults: function(defaultProps) {
        return {

            create: function(props, classProps) {
                var propsWithDefaults = _.extend({}, defaultProps, props);

                return createRouter(propsWithDefaults, classProps);
            }

        };
    }

};

function createRouter(props, classProps) {
    var BrisketRouter = Router.extend(props, classProps);

    return BrisketRouter;
}

module.exports = RouterBrewery;

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
