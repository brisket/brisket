"use strict";

var ConsoleLogger = require("lib/logging/ConsoleLogger");

describe("ConsoleLogger", function() {
    it("calls console.log on debug", function() {
        spyOn(console, "log");
        ConsoleLogger.debug("test");
        expect(console.log).toHaveBeenCalled();
    });

    it("calls console.log on info", function() {
        spyOn(console, "info");
        ConsoleLogger.info("test");
        expect(console.info).toHaveBeenCalled();
    });

    it("calls console.log on warn", function() {
        spyOn(console, "warn");
        ConsoleLogger.warn("test");
        expect(console.warn).toHaveBeenCalled();
    });

    it("calls console.log on error", function() {
        spyOn(console, "error");
        ConsoleLogger.error("test");
        expect(console.error).toHaveBeenCalled();
    });

    it("calls console.log on fatal", function() {
        spyOn(console, "error");
        ConsoleLogger.fatal("test");
        expect(console.error).toHaveBeenCalled();
    });
});
