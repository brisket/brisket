"use strict";

describe("BrisketTesting", function() {
    var BrisketTesting = require("../../testing");
    var Backbone = require("../../lib/application/Backbone");
    var Events = require("../../lib/events/Events");
    var Layout = require("../../lib/viewing/Layout");
    var View = require("../../lib/viewing/View");
    var $ = require("../../lib/application/jquery");
    var noop = require("../../lib/util/noop");

    it("configures Backbone", function() {
        expect(Backbone.$).toBe($);
    });

    it("does NOT allow layout to reattach", function() {
        expect(Layout.prototype.reattach).toBe(noop);
    });

    describe("#enableEvents", function() {

        beforeEach(function() {
            BrisketTesting.enableEvents();
        });

        afterEach(function() {
            BrisketTesting.disableEvents();
        });

        it("enables events", function() {
            expect(View.prototype.delegateEvents).toBe(Backbone.View.prototype.delegateEvents);
            expect(View.prototype.undelegateEvents).toBe(Backbone.View.prototype.undelegateEvents);

            hasEvents(View.prototype);
            hasEvents(Events);
        });

    });

    describe("disableEvents", function() {

        beforeEach(function() {
            BrisketTesting.enableEvents();
            BrisketTesting.disableEvents();
        });

        it("disables events", function() {
            expect(View.prototype.delegateEvents).not.toBe(Backbone.View.prototype.delegateEvents);
            expect(View.prototype.undelegateEvents).not.toBe(Backbone.View.prototype.undelegateEvents);

            spyOn(Backbone.View.prototype, "delegateEvents");
            spyOn(Backbone.View.prototype, "undelegateEvents");

            View.prototype.delegateEvents();
            View.prototype.undelegateEvents();

            expect(Backbone.View.prototype.delegateEvents).not.toHaveBeenCalled();
            expect(Backbone.View.prototype.undelegateEvents).not.toHaveBeenCalled();

            doesNotHaveEvents(View.prototype);
            doesNotHaveEvents(Events);
        });
    });

    function hasEvents(object) {
        expect(object.on).toBe(Backbone.Events.on);
        expect(object.off).toBe(Backbone.Events.off);
        expect(object.trigger).toBe(Backbone.Events.trigger);
        expect(object.listenTo).toBe(Backbone.Events.listenTo);
        expect(object.once).toBe(Backbone.Events.once);
        expect(object.stopListening).toBe(Backbone.Events.stopListening);
        expect(object.listenToOnce).toBe(Backbone.Events.listenToOnce);
    }

    function doesNotHaveEvents(object) {
        expect(object.on).toBe(noop);
        expect(object.off).toBe(noop);
        expect(object.trigger).toBe(noop);
        expect(object.listenTo).toBe(noop);
        expect(object.once).toBe(noop);
        expect(object.stopListening).toBe(noop);
        expect(object.listenToOnce).toBe(noop);
    }

});
