"use strict";

describe("Brisket server", function() {
    var Brisket = require("../../lib/brisket");
    var MockBrisketApp = require("../mock/MockBrisketApp");
    var nock = require("nock");
    var supertest = require("supertest");

    var brisketServer;

    beforeEach(function() {
        MockBrisketApp.initialize();

        nock("http://api.example.com")
            .get("/fetch200")
            .reply(200, { ok: true })
            .get("/fetch404")
            .reply(404, { ok: false })
            .get("/fetch500")
            .reply(500, { ok: false })
            .get("/fetch410")
            .reply(410, { ok: false });

        brisketServer = Brisket.createServer({
            apis: {
                "api": {
                    host: "http://api.example.com",
                    proxy: null
                }
            }
        });
    });

    afterEach(function() {
        MockBrisketApp.cleanup();
        nock.cleanAll();
    });

    it("returns 200 when route is working", function(done) {
        supertest(brisketServer)
            .get("/working")
            .expect(200, mocha(done));
    });

    it("returns 500 when route is failing", function(done) {
        supertest(brisketServer)
            .get("/failing")
            .expect(500, mocha(done));
    });

    it("returns 302 when route is redirecting", function(done) {
        supertest(brisketServer)
            .get("/redirecting")
            .expect(302, mocha(done));
    });

    it("returns status from route when route sets status", function(done) {
        supertest(brisketServer)
            .get("/setsStatus")
            .expect(206, mocha(done));
    });

    it("returns 200 when data fetch is 200 AND route code doesn't error", function(done) {
        supertest(brisketServer)
            .get("/fetch200")
            .expect(200, mocha(done));
    });

    it("returns 500 when data fetch is 200 BUT route code errors", function(done) {
        supertest(brisketServer)
            .get("/fetch200ButRouteFails")
            .expect(500, mocha(done));
    });

    it("returns 302 when data fetch is 200 BUT route code redirects", function(done) {
        supertest(brisketServer)
            .get("/fetch200ButRouteRedirects")
            .expect(302, mocha(done));
    });

    it("returns status from route when data fetch is 200 BUT route sets status", function(done) {
        supertest(brisketServer)
            .get("/fetch200ButRouteSetsStatus")
            .expect(206, mocha(done));
    });

    it("returns 404 when route does NOT exist", function(done) {
        supertest(brisketServer)
            .get("/doesntexist")
            .expect(404, mocha(done));
    });

    it("returns 404 when data fetch is 404", function(done) {
        supertest(brisketServer)
            .get("/fetch404")
            .expect(404, mocha(done));
    });

    it("returns 500 when data fetch is 500", function(done) {
        supertest(brisketServer)
            .get("/fetch500")
            .expect(500, mocha(done));
    });

    it("returns 500 when data fetch is unexpected error code", function(done) {
        supertest(brisketServer)
            .get("/fetch410")
            .expect(500, mocha(done));
    });

    function mocha(done) {
        return function(err) {
            if (err) {
                done.fail(err);
            } else {
                done();
            }
        };
    }
});
