"use strict";

var Environment = require("lib/environment/Environment");

describe("Environment", function() {

    it("can be fully mocked out by just setting isServer", function() {
        spyOn(Environment, "isServer").and.returnValue(true);
        expect(Environment.isServer()).toBe(true);
        expect(Environment.isClient()).toBe(false);

        Environment.isServer.and.returnValue(false);
        expect(Environment.isServer()).toBe(false);
        expect(Environment.isClient()).toBe(true);
    });

});

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
