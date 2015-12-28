"use strict";

describe("deprecated", function() {
    var deprecated = require("lib/util/deprecated");

    beforeEach(function() {
        spyOn(console, "warn");
    });

    it("console warns a deprecated message", function() {
        deprecated("feature is deprecated");

        expect(console.warn).toHaveBeenCalledWith("[DEPRECATED] feature is deprecated");
    });

    it("console warns a deprecated message with a help page", function() {
        deprecated("feature is deprecated", "http://github.com/bloomberg/brisket/issues/11");

        expect(console.warn).toHaveBeenCalledWith(
            "[DEPRECATED] feature is deprecated. " +
            "Go to http://github.com/bloomberg/brisket/issues/11 for full documentation."
        );
    });

});
