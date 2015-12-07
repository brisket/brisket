"use strict";

var prepareForApiHost = require("../../lib/server/prepareForApiHost");

describe("prepareForApiHost", function() {
    var prepareForApiHostMiddleware;
    var apiHost;
    var options;

    beforeEach(function() {
        apiHost = "http://api.example.com/";
        options = {};
        prepareForApiHostMiddleware = prepareForApiHost(apiHost);
    });

    describe("when sync request's url starts with '/api'", function() {

        it("replaces ^/api with apiHost", function() {
            options.url = "/api/path/to/data";
            prepareForApiHostMiddleware("GET", null, options);

            expect(options.url).toBe("http://api.example.com/path/to/data");
        });

    });

    describe("when sync request's url starts with 'api'", function() {

        it("replaces ^api with apiHost", function() {
            options.url = "api/path/to/data";
            prepareForApiHostMiddleware("GET", null, options);

            expect(options.url).toBe("http://api.example.com/path/to/data");
        });

    });

    describe("when sync request's url is an absolute url path", function() {

        it("replaces ^/ with apiHost", function() {
            options.url = "/notapi/path/to/data";
            prepareForApiHostMiddleware("GET", null, options);

            expect(options.url).toBe("http://api.example.com/notapi/path/to/data");
        });

    });

    describe("when sync request's url is a relative url path", function() {

        it("replaces ^ with apiHost", function() {
            options.url = "notapi/path/to/data";
            prepareForApiHostMiddleware("GET", null, options);

            expect(options.url).toBe("http://api.example.com/notapi/path/to/data");
        });

    });

});

// ----------------------------------------------------------------------------
// Copyright (C) 2015 Bloomberg Finance L.P.
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
