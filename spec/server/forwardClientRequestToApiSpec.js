"use strict";

describe("forwardClientRequestToApi", function() {
    var forwardClientRequestToApi = require("../../lib/server/forwardClientRequestToApi");

    var apiConfig;
    var forwardClientRequestToApiMiddleware;
    var req;
    var res;
    var pipe;

    beforeEach(function() {
        apiConfig = {
            host: "http://api.example.com"
        };

        spyOn(forwardClientRequestToApi, "request").and.returnValue(true);

        pipe = jasmine.createSpy('pipe').and.callFake(function() {
            return this;
        });

        req = {
            url: "/model/1",
            pipe: pipe
        };
    });

    it("replaces /api with apiConfig.host", function() {
        givenApiConfigHost();
        whenMiddlewareRuns();

        expect(forwardClientRequestToApi.request).toHaveBeenCalledWith({
            url: "http://api.example.com/model/1",
            proxy: undefined
        });
    });

    it("pipes request and response", function() {
        givenApiConfigHost();
        whenMiddlewareRuns();

        expect(pipe).toHaveBeenCalledWith(true);
        expect(pipe).toHaveBeenCalledWith(res);
    });

    it("pipes request with proxy", function() {
        givenApiConfigProxy();
        whenMiddlewareRuns();

        expect(forwardClientRequestToApi.request).toHaveBeenCalledWith({
            url: "http://api.example.com/model/1",
            proxy: "http://proxy.example.com"
        });
    });

    function givenApiConfigHost() {
        apiConfig = {
            host: "http://api.example.com"
        };
    }

    function givenApiConfigProxy() {
        apiConfig = {
            host: "http://api.example.com",
            proxy: "http://proxy.example.com"
        };
    }

    function whenMiddlewareRuns() {
        forwardClientRequestToApiMiddleware = forwardClientRequestToApi(apiConfig);
        forwardClientRequestToApiMiddleware(req, res);
    }
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
