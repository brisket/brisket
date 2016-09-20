"use strict";

describe("constructQualifiedUrl", function() {
    var constructQualifiedUrl = require("lib/util/constructQualifiedUrl");

    describe("parameters", function() {

        it("requires a protocol", function() {
            expect(callWithoutProtocol()).toBe(null);
        });

        it("requires a host", function() {
            expect(callWithoutHost()).toBe(null);
        });

    });

    describe("when called without a host and protocol, but not a path", function() {

        it("returns a URL with the protocol and host", function() {
            expect(callWithoutPath()).toEqual("protocol://host");
        });

    });

    describe("when called with a protocol, host, and path", function() {

        it("returns a URL with the protocol, host, and path", function() {
            expect(callWithAllArguments()).toEqual("protocol://host/path");
        });

    });

    function callWithoutProtocol() {
        return constructQualifiedUrl({
            host: "host"
        });
    }

    function callWithoutHost() {
        return constructQualifiedUrl({
            protocol: "protocol"
        });
    }

    function callWithoutPath() {
        return constructQualifiedUrl({
            protocol: "protocol",
            host: "host"
        });
    }

    function callWithAllArguments() {
        return constructQualifiedUrl({
            protocol: "protocol",
            host: "host",
            path: "/path"
        });
    }

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
