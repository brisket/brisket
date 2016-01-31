"use strict";

var isExternalLinkTarget = require("lib/controlling/isExternalLinkTarget");

describe("isExternalLinkTarget", function() {

    it("returns true when target is '_blank'", function() {
        expect(isExternalLinkTarget("_blank")).toBe(true);
    });

    it("returns false when target is a named window", function() {
        expect(isExternalLinkTarget("myWindow")).toBe(true);
    });

    it("returns false when target is '_self'", function() {
        expect(isExternalLinkTarget("_self")).toBe(false);
    });

    it("returns false when target is not passed", function() {
        expect(isExternalLinkTarget()).toBe(false);
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
