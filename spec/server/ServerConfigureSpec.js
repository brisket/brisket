"use strict";

describe("ServerConfigure", function() {
    var ServerConfigure = require("../../lib/server/ServerConfigure");
    var applicationJquery = require("../../lib/application/jquery");
    var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

    describe("#configureJquery", function() {

        beforeEach(function() {
            ServerConfigure.configureJquery();
        });

        it("tells application jquery to support cors for server side requests", function() {
            expect(applicationJquery.support.cors).toBe(true);
        });

        it("ensures application jquery's xhr transport exists", function() {
            var xhrTransport = applicationJquery.ajaxSettings.xhr();
            expect(xhrTransport instanceof XMLHttpRequest).toBe(true);
        });

    });

});
