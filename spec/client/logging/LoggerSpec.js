"use strict";

var Logger = require("lib/logging/Logger");
var SampleLogger;

describe("Logger", function() {
    beforeEach(function() {
        SampleLogger = {
            debug: function() {},
            info: function() {},
            warn: function() {},
            error: function() {},
            fatal: function() {}
        };
        Logger.use(SampleLogger);
    });

    describe("#setLogLevel", function() {
        beforeEach(function() {
            Logger.setLogLevel("warn");
        });

        it("does not call debug", function() {
            spyOn(Logger.loggerInterface, "debug");
            Logger.debug("example");
            expect(Logger.loggerInterface.debug).not.toHaveBeenCalled();
        });

        it("does not call info", function() {
            spyOn(Logger.loggerInterface, "info");
            Logger.info("example");
            expect(Logger.loggerInterface.info).not.toHaveBeenCalled();
        });

        it("calls warn", function() {
            spyOn(Logger.loggerInterface, "warn");
            Logger.warn("example");
            expect(Logger.loggerInterface.warn).toHaveBeenCalled();
        });

        it("calls error", function() {
            spyOn(Logger.loggerInterface, "error");
            Logger.error("example");
            expect(Logger.loggerInterface.error).toHaveBeenCalled();
        });

        it("calls fatal", function() {
            spyOn(Logger.loggerInterface, "fatal");
            Logger.fatal("example");
            expect(Logger.loggerInterface.fatal).toHaveBeenCalled();
        });

    });

    describe("custom logger", function() {
        beforeEach(function() {
            Logger.setLogLevel("debug");
        });

        it("#use", function() {
            expect(Logger.loggerInterface).toEqual(SampleLogger);
        });

        it("proxies debug", function() {
            spyOn(SampleLogger, "debug");
            Logger.debug("example message");
            expect(SampleLogger.debug).toHaveBeenCalled();
        });

        it("proxies info", function() {
            spyOn(SampleLogger, "info");
            Logger.info("example message");
            expect(SampleLogger.info).toHaveBeenCalled();
        });

        it("proxies warn", function() {
            spyOn(SampleLogger, "warn");
            Logger.warn("example message");
            expect(SampleLogger.warn).toHaveBeenCalled();
        });

        it("proxies error", function() {
            spyOn(SampleLogger, "error");
            Logger.error("example message");
            expect(SampleLogger.error).toHaveBeenCalled();
        });

        it("proxies fatal", function() {
            spyOn(SampleLogger, "fatal");
            Logger.fatal("example message");
            expect(SampleLogger.fatal).toHaveBeenCalled();
        });

    });
});
