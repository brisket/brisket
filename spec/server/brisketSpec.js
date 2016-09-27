"use strict";

describe("public interface to Brisket", function() {
    var Brisket = require("../../lib/brisket");

    it("exposes Brisket.App", function() {
        expect(Brisket.App).toBe(requireFromLib("application/App"));
    });

    it("exposes Brisket.Router", function() {
        expect(Brisket.Router).toBe(requireFromLib("controlling/Router"));
    });

    it("exposes Brisket.View", function() {
        expect(Brisket.View).toBe(requireFromLib("viewing/View"));
    });

    it("exposes Brisket.ErrorViewMapping", function() {
        expect(Brisket.ErrorViewMapping).toBe(requireFromLib("errors/ErrorViewMapping"));
    });

    it("exposes Brisket.Events", function() {
        expect(Brisket.Events).toBe(requireFromLib("events/Events"));
    });

    it("exposes Brisket.Layout", function() {
        expect(Brisket.Layout).toBe(requireFromLib("viewing/Layout"));
    });

    it("exposes Brisket.Templating.TemplateAdapter", function() {
        expect(Brisket.Templating.TemplateAdapter).toBe(requireFromLib("templating/TemplateAdapter"));
    });

    it("exposes Brisket.Templating.StringTemplateAdapter", function() {
        expect(Brisket.Templating.StringTemplateAdapter).toBe(requireFromLib("templating/StringTemplateAdapter"));
    });

    it("exposes Brisket.Testing (deprecated)", function() {
        expect(Brisket.Testing).toBe(requireFromLib("testing/Testing"));
    });

    it("exposes Brisket.createServer", function() {
        expect(Brisket.createServer).toBe(requireFromLib("server/Server").create);
    });

    it("exposes Backbone as Brisket.Backbone", function() {
        expect(Brisket.Backbone).toBe(requireFromLib("application/Backbone"));
    });

    it("exposes jquery as Brisket.$", function() {
        expect(Brisket.$).toBe(requireFromLib("application/jquery"));
    });

    it("exposes Brisket.version", function() {
        expect(Brisket.version).toBe(require("../../package.json").version);
    });

    it("exposes Brisket.onError", function() {
        expect(Brisket.onError).toBe(requireFromLib("errors/Errors").onError);
    });

    function requireFromLib(path) {
        return require("../../lib/" + path);
    }
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
