"use strict";

var forwardClientRequestToApi = require("../../lib/server/forwardClientRequestToApi");

describe("forwardClientRequestToApi", function() {

    it("returns a middleware handler", function(){
        var result = forwardClientRequestToApi('localhost');
        expect(typeof(result)).toBe("function");
    });

    describe("middleware handler", function() {
        var apiHost;
        var middleware;
        var mockRequest;
        var mockResponse;
        var mockNext;

        beforeEach(function() {
            apiHost = 'http://api.example.com:8080';
            middleware = forwardClientRequestToApi(apiHost);

            mockRequest = {
                url: "/aRoute?aParam=true",
                headers: {
                    host: "http://www.example.com",
                }
            };

            mockResponse = {};

            mockNext = jasmine.createSpy();
        });

        it("should call next if header is not set", function(){
            middleware(mockRequest, mockResponse, mockNext);
            expect(mockNext).toHaveBeenCalled();
        });

        describe("header is set", function(){
            beforeEach(function() {
                mockRequest.headers['brisket-client'] = true;
            });

            it("should call request with apiHost and full url", function() {
                middleware(mockRequest, mockResponse, mockNext);
                expect(mockNext).not.toHaveBeenCalled();
            });

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
