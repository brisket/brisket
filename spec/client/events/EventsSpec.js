"use strict";

describe("Events", function() {
    var Events = require("lib/events/Events");
    var Backbone = require("lib/application/Backbone");

    it("proxies on to Backbone.Events", function() {
        expect(Events.on).toBe(Backbone.Events.on);
    });

    it("proxies once to Backbone.Events", function() {
        expect(Events.once).toBe(Backbone.Events.once);
    });

    it("proxies trigger to Backbone.Events", function() {
        expect(Events.trigger).toBe(Backbone.Events.trigger);
    });

    it("proxies off to Backbone.Events", function() {
        expect(Events.off).toBe(Backbone.Events.off);
    });

    it("proxies stopListening to Backbone.Events", function() {
        expect(Events.stopListening).toBe(Backbone.Events.stopListening);
    });

    it("proxies listenTo to Backbone.Events", function() {
        expect(Events.listenTo).toBe(Backbone.Events.listenTo);
    });

    it("proxies listenToOnce to Backbone.Events", function() {
        expect(Events.listenToOnce).toBe(Backbone.Events.listenToOnce);
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
