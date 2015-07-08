"use strict";

var NoopLogger = require("lib/logging/NoopLogger");
var noop = require("lib/util/noop");

describe("NoopLogger", function() {

    it("proxies debug to noop", function() {
        expect(NoopLogger.debug).toBe(noop);
    });

    it("proxies info to noop", function() {
        expect(NoopLogger.info).toBe(noop);
    });

    it("proxies warn to noop", function() {
        expect(NoopLogger.warn).toBe(noop);
    });

    it("proxies error to noop", function() {
        expect(NoopLogger.error).toBe(noop);
    });

    it("proxies fatal to noop", function() {
        expect(NoopLogger.fatal).toBe(noop);
    });

});
