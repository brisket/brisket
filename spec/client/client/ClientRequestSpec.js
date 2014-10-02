"use strict";

var ClientRequest = require("lib/client/ClientRequest");

describe("ClientRequest", function() {
    var clientRequest;
    var requestId;

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

    });

    function mockWindow() {
        return {
            document: {
                referrer: "theReferrer"
            },
            location: {
                protocol: "http:",
                host: "example.com:8080",
                pathname: "/requested/path",
                search: "?some=param&another[param]=value"
            },
            navigator: {
                userAgent: "A wonderful computer"
            }
        };
    }

});

// ----------------------------------------------------------------------------
// Copyright (C) 2014 Bloomberg Finance L.P.
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
