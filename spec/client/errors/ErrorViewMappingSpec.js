"use strict";

var ErrorViewMapping = require("lib/errors/ErrorViewMapping");
var ErrorViews = require("lib/errors/ErrorViews");
var Backbone = require("lib/application/Backbone");

describe("ErrorViewMapping", function() {

    var errorViews;

    it("creates instances of ErrorViews", function() {
        errorViews = ErrorViewMapping.create({
            500: Backbone.View
        });

        expect(errorViews instanceof ErrorViews).toBe(true);
    });

});

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
