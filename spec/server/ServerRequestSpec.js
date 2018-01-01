"use strict";

describe("ServerRequest", function() {
    var ServerRequest = require("../../lib/server/ServerRequest");
    var MockExpressRequest = require("../mock/MockExpressRequest");
    var noop = require("../../lib/util/noop");

    var serverRequest;

    describe("from returns Brisket normalized values", function() {

        beforeEach(function() {
            serverRequest = ServerRequest.from(MockExpressRequest.basic());
        });

        it("exposes protocol", function() {
            expect(serverRequest.protocol).toBe("http");
        });

        it("exposes full host with port", function() {
            expect(serverRequest.host).toBe("example.com:8080");
        });

        it("exposes hostname", function() {
            expect(serverRequest.hostname).toBe("example.com");
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

        it("exposes request raw query", function() {
            expect(serverRequest.rawQuery).toEqual("some=param&another%5Bparam%5D=value");
        });

        it("exposes request with no query params", function() {
            var serverRequestNoQueryParam = ServerRequest.from(MockExpressRequest.withoutQueryParam());
            expect(serverRequestNoQueryParam.rawQuery).toEqual(null);
            expect(serverRequestNoQueryParam.query).toEqual(undefined);
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

        it("exposes noop for onRouteComplete", function() {
            expect(serverRequest.onComplete).toBe(noop);
        });

        it("exposes noop for complete", function() {
            expect(serverRequest.complete).toBe(noop);
        });

    });

    describe("environmentConfig", function() {

        it("exposes environmentConfig when created WITH one", function() {
            serverRequest = ServerRequest.from(MockExpressRequest.basic(), {
                "a": "b",
                "c": "d"
            });

            expect(serverRequest.environmentConfig).toEqual({
                "a": "b",
                "c": "d"
            });
        });

        it("exposes empty environmentConfig when created WITHOUT one", function() {
            serverRequest = ServerRequest.from(MockExpressRequest.basic());

            expect(serverRequest.environmentConfig).toEqual({});
        });

    });

    describe("when environmentConfig has appRoot", function() {

        beforeEach(function() {
            serverRequest = ServerRequest.from(MockExpressRequest.basic(), {
                appRoot: "/appRoot"
            });
        });

        it("exposes path", function() {
            expect(serverRequest.path).toBe("/appRoot/requested/path");
        });

        it("exposes applicationPath", function() {
            expect(serverRequest.applicationPath).toBe("requested/path");
        });

    });

    describe("when environmentConfig does NOT have appRoot", function() {

        beforeEach(function() {
            serverRequest = ServerRequest.from(MockExpressRequest.basic(), {});
        });

        it("exposes path", function() {
            expect(serverRequest.path).toBe("/requested/path");
        });

        it("exposes applicationPath", function() {
            expect(serverRequest.applicationPath).toBe("requested/path");
        });

    });

    describe("cookies", function() {

        it("exposes cookies when express request provides them", function() {
            var expressRequestWithCookies = MockExpressRequest.basic();
            expressRequestWithCookies.cookies = {
                "foo": "a",
                "bar": "b"
            };

            serverRequest = ServerRequest.from(expressRequestWithCookies);

            expect(serverRequest.cookies).toEqual({
                "foo": "a",
                "bar": "b"
            });
        });

        it("exposes cookies as null when express request does NOT provide them", function() {
            serverRequest = ServerRequest.from(MockExpressRequest.basic());

            expect(serverRequest.cookies).toBeNull();
        });

    });

});

// ----------------------------------------------------------------------------
// Copyright (C) 2018 Bloomberg Finance L.P.
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
