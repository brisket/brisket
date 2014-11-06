"use strict";

var Brisket = require("../../lib/brisket");

describe("public interface to Brisket", function() {

    it("exposes Brisket.RouterBrewery", function() {
        expect(Brisket.RouterBrewery).toBe(requireFromLib("controlling/RouterBrewery"));
    });

    it("exposes Brisket.Routers", function() {
        expect(Brisket.Routers).toBe(requireFromLib("controlling/Routers"));
    });

    it("exposes Brisket.Controller", function() {
        expect(Brisket.Controller).toBe(requireFromLib("controlling/Controller"));
    });

    it("exposes Brisket.Model", function() {
        expect(Brisket.Model).toBe(requireFromLib("modeling/Model"));
    });

    it("exposes Brisket.Collection", function() {
        expect(Brisket.Collection).toBe(requireFromLib("modeling/Collection"));
    });

    it("exposes Brisket.View", function() {
        expect(Brisket.View).toBe(requireFromLib("viewing/View"));
    });

    it("exposes Brisket.ErrorViewMapping", function() {
        expect(Brisket.ErrorViewMapping).toBe(requireFromLib("errors/ErrorViewMapping"));
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

    it("exposes Brisket.Templating.compiledHoganTemplateAdapter", function() {
        expect(Brisket.Templating.compiledHoganTemplateAdapter).toBe(requireFromLib("templating/compiledHoganTemplateAdapter"));
    });

    it("exposes Brisket.ServerApp", function() {
        expect(Brisket.ServerApp).toBe(requireFromLib("server/ServerApp"));
    });

    it("exposes Brisket.ClientApp", function() {
        expect(Brisket.ClientApp).toBe(requireFromLib("client/ClientApp"));
    });

    it("exposes Brisket.Testing", function() {
        expect(Brisket.Testing).toBe(requireFromLib("testing/Testing"));
    });

    it("exposes Brisket.createServer", function() {
        expect(Brisket.createServer).toBe(requireFromLib("server/Server").create);
    });

    it("exposes Brisket.Layout.Metatags", function() {
        expect(Brisket.Layout.Metatags).toBe(requireFromLib("metatags/Metatags"));
    });

    it("exposes Backbone as Brisket.Backbone", function() {
        expect(Brisket.Backbone).toBe(requireFromLib("application/Backbone"));
    });

    it("exposes jquery as Brisket.$", function() {
        expect(Brisket.$).toBe(requireFromLib("application/jquery"));
    });

    it("exposes Brisket.EventBus", function() {
        expect(Brisket.onError).toBe(requireFromLib("errors/Errors").onError);
    });

    function requireFromLib(path) {
        return require("../../lib/" + path);
    }
});

// ----------------------------------------------------------------------------
// Copyright (C) 2014 Bloomberg Finance L.P.
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
