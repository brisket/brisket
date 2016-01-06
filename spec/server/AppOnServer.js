"use strict";

describe("App on server", function() {
    var App = require("../../lib/application/App");

    it("does NOT error when you call start", function() {
        function callingAppStartOnServer() {
            App.start();
        }

        expect(callingAppStartOnServer).not.toThrow();
    });

});
