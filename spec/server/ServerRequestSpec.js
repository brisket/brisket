"use strict";

var ServerRequest = require("../../lib/server/ServerRequest");

describe("ServerRequest", function() {
    var serverRequest;

    describe("from returns Brisket normalized values", function() {

        beforeEach(function() {
            serverRequest = ServerRequest.from(mockExpressRequest());
        });

        it("exposes protocol", function() {
            expect(serverRequest.protocol).toBe("http");
        });

        it("exposes path", function() {
            expect(serverRequest.path).toBe("/requested/path");
        });

        it("exposes full host with port", function() {
            expect(serverRequest.host).toBe("example.com:8080");
        });

        it("exposes user agent", function() {
            expect(serverRequest.userAgent).toBe("A wonderful computer");
        });

        it("exposes request query", function() {
            expect(serverRequest.query).toEqual({
                some: "param",
                another: {
                    param: "value"
                }
            });
        });

        it("exposes the referrer", function() {
            expect(serverRequest.referrer).toEqual("theReferrer.com");
        });

        it("exposes isFirstRequest (always true)", function() {
            expect(serverRequest.isFirstRequest).toBe(true);
        });

        it("exposes requestId (always 1)", function() {
            expect(serverRequest.requestId).toBe(1);
        });

        it("exposes isNotClick as false", function() {
            expect(serverRequest.isNotClick).toBe(false);
        });

    });

    function mockExpressRequest() {
        return {
            protocol: "http",
            path: "/requested/path",
            host: "example.com",
            headers: {
                "host": "example.com:8080",
                "referer": "theReferrer.com",
                "user-agent": "A wonderful computer"
            },
            query: {
                some: "param",
                another: {
                    param: "value"
                }
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
