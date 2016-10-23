"use strict";

describe("Deprecated", function() {
    var Deprecated = require("../../../lib/util/Deprecated");

    beforeEach(function() {
        spyOn(console, "warn");
        Deprecated.message.and.callThrough();
    });

    it("console warns a deprecation message", function() {
        Deprecated.message("feature is deprecated");

        expect(console.warn).toHaveBeenCalledWith("[DEPRECATED] feature is deprecated");
    });

    it("console warns a deprecation message with a help page", function() {
        Deprecated.message("feature is deprecated", "http://github.com/bloomberg/brisket/issues/11");

        expect(console.warn).toHaveBeenCalledWith(
            "[DEPRECATED] feature is deprecated. " +
            "Go to http://github.com/bloomberg/brisket/issues/11 for full documentation."
        );
    });

});
