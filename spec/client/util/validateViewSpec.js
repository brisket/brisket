"use strict";

describe("validateView", function() {
    var validateView = require("lib/util/validateView");
    var Backbone = require("lib/application/Backbone");
    var View = require("lib/viewing/View");
    var _ = require("underscore");

    it("does NOT throw when passed a Backbone.View", function() {
        function validatingABackboneView() {
            validateView(new Backbone.View());
        }

        expect(validatingABackboneView).not.toThrow();
    });

    it("does NOT throw when passed a Brisket.View", function() {
        function validatingABrisketView() {
            validateView(new View());
        }

        expect(validatingABrisketView).not.toThrow();
    });

    it("throws when passed anything else", function() {
        var anythingElse = [
            1,
            "a string",
            View,
            null,
            undefined
        ];

        _.each(anythingElse, function(anything) {
            expect(function() {
                validateView(anything);
            }).toThrow();
        });
    });

});
