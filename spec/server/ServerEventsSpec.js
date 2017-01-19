"use strict";

describe("Events", function() {
    var Events = require("../../lib/events/Events");
    var noop = require("../../lib/util/noop");

    it("noops on", function() {
        expect(Events.on).toBe(noop);
    });

    it("noops off", function() {
        expect(Events.off).toBe(noop);
    });

    it("noops trigger", function() {
        expect(Events.trigger).toBe(noop);
    });

    it("noops once", function() {
        expect(Events.once).toBe(noop);
    });

    it("noops listenTo", function() {
        expect(Events.listenTo).toBe(noop);
    });

    it("noops listenToOnce", function() {
        expect(Events.listenToOnce).toBe(noop);
    });

    it("noops stopListening", function() {
        expect(Events.stopListening).toBe(noop);
    });

});

// ----------------------------------------------------------------------------
// Copyright (C) 2017 Bloomberg Finance L.P.
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
