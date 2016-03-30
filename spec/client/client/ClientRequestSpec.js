"use strict";

describe("ClientRequest", function() {
    var ClientRequest = require("lib/client/ClientRequest");
    var mockWindow = require("mock/mockWindow");

    var clientRequest;
    var requestId;

    afterEach(function() {
        ClientRequest.reset();
    });

    describe("from returns Brisket normalized values", function() {

        beforeEach(function() {
            clientRequest = ClientRequest.from(mockWindow());
        });

        it("exposes protocol", function() {
            expect(clientRequest.protocol).toBe("http");
        });

        it("exposes path", function() {
            expect(clientRequest.path).toBe("/requested/path");
        });

        it("exposes full host with port", function() {
            expect(clientRequest.host).toBe("example.com:8080");
        });

        it("exposes hostname", function() {
            expect(clientRequest.hostname).toBe("example.com");
        });

        it("exposes user agent", function() {
            expect(clientRequest.userAgent).toBe("A wonderful computer");
        });

        it("exposes request query", function() {
            expect(clientRequest.query).toEqual({
                some: "param",
                another: {
                    param: "value"
                }
            });
        });

        it("exposes request raw query", function() {
            expect(clientRequest.rawQuery).toEqual("some=param&another%5Bparam%5D=value");
        });

        it("exposes the referrer", function() {
            expect(clientRequest.referrer).toEqual("theReferrer");
        });

        describe("when it is the first request", function() {

            beforeEach(function() {
                requestId = 1;
                clientRequest = ClientRequest.from(mockWindow(), requestId);
            });

            it("exposes isFirstRequest as true", function() {
                expect(clientRequest.isFirstRequest).toBe(true);
            });

            it("exposes requestId as 1", function() {
                expect(clientRequest.requestId).toBe(1);
            });

            it("exposes isNotClick as false", function() {
                expect(clientRequest.isNotClick).toBe(false);
            });

        });

        describe("when it is NOT the first request", function() {

            beforeEach(function() {
                requestId = 2;
                clientRequest = ClientRequest.from(mockWindow(), requestId);
            });

            it("exposes isFirstRequest as false", function() {
                expect(clientRequest.isFirstRequest).toBe(false);
            });

            it("exposes requestId as 2", function() {
                expect(clientRequest.requestId).toBe(2);
            });

            it("exposes isNotClick as true when request is not created because of link click", function() {
                expect(clientRequest.isNotClick).toBe(true);
            });

            describe("when request is from link click", function() {

                beforeEach(function() {
                    ClientRequest.isFromLinkClick();
                    clientRequest = ClientRequest.from(mockWindow(), requestId);
                });

                it("exposes isNotClick as true", function() {
                    expect(clientRequest.isNotClick).toBe(false);
                });

            });

        });

        describe("when the previous request is set", function() {

            beforeEach(function() {
                var firstRequest = ClientRequest.from(mockWindow());
                ClientRequest.setPreviousRequest(firstRequest);
                clientRequest = ClientRequest.from(mockWindow());
            });

            it("sets the referrer from the previous request", function() {
                expect(clientRequest.referrer).toEqual("http://example.com:8080/requested/path");
            });

        });

        describe("environmentConfig", function() {

            it("exposes environmentConfig when environmentConfig has been set", function() {
                clientRequest = ClientRequest.from(mockWindow(), 1, {
                    "a": "b",
                    "c": "d"
                });

                expect(clientRequest.environmentConfig).toEqual({
                    "a": "b",
                    "c": "d"
                });
            });

            it("exposes empty environmentConfig when environmentConfig has NOT been set", function() {
                clientRequest = ClientRequest.from(mockWindow());

                expect(clientRequest.environmentConfig).toEqual({});
            });

        });

        describe("when environmentConfig has appRoot", function() {

            beforeEach(function() {
                var windough = mockWindow();
                windough.location.pathname = "/appRoot" + windough.location.pathname;

                clientRequest = ClientRequest.from(windough, 1, {
                    appRoot: "/appRoot"
                });
            });

            it("exposes applicationPath", function() {
                expect(clientRequest.applicationPath).toBe("requested/path");
            });

        });

        describe("when environmentConfig does NOT have appRoot", function() {

            beforeEach(function() {
                clientRequest = ClientRequest.from(mockWindow(), 1);
            });

            it("exposes applicationPath", function() {
                expect(clientRequest.applicationPath).toBe("requested/path");
            });

        });

        describe("when server has cookies", function() {
            var mockWindowWithCookies;
            var mockWindowWithSameCookies;
            var mockWindowWithNewCookies;
            var nextClientRequest;

            beforeEach(function() {
                mockWindowWithCookies = mockWindow();
                mockWindowWithCookies.document.cookie = "foo=a; bar=b";

                clientRequest = ClientRequest.from(mockWindowWithCookies, 1, {
                    "brisket:wantsCookies": true
                });
            });

            it("exposes parsed cookies when server", function() {
                expect(clientRequest.cookies).toEqual({
                    "foo": "a",
                    "bar": "b"
                });
            });

            it("updates cookies on next request when cookies do not change", function() {
                mockWindowWithSameCookies = mockWindow();
                mockWindowWithSameCookies.document.cookie = "foo=a; bar=b";

                nextClientRequest = ClientRequest.from(mockWindowWithSameCookies, 2, {
                    "brisket:wantsCookies": true
                });

                expect(nextClientRequest.cookies).toEqual({
                    "foo": "a",
                    "bar": "b"
                });
            });

            it("updates cookies on next request when cookies change", function() {
                mockWindowWithNewCookies = mockWindow();
                mockWindowWithNewCookies.document.cookie = "notfoo=bar;";

                nextClientRequest = ClientRequest.from(mockWindowWithNewCookies, 2, {
                    "brisket:wantsCookies": true
                });

                expect(nextClientRequest.cookies).toEqual({
                    "notfoo": "bar"
                });
            });

        });

        describe("when server does NOT have cookies", function() {

            it("exposes cookies as null", function() {
                clientRequest = ClientRequest.from(mockWindow(), 1, {
                    "brisket:wantsCookies": false
                });

                expect(clientRequest.cookies).toBeNull();
            });

        });

    });

});

// ----------------------------------------------------------------------------
// Copyright (C) 2016 Bloomberg Finance L.P.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------- END-OF-FILE ----------------------------------
