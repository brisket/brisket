"use strict";

var ServerResponseWorkflow = require("../../lib/server/ServerResponseWorkflow");
var Errors = require("../../lib/errors/Errors");
var Promise = require("bluebird");

describe("ServerResponseWorkflow", function() {

    var mockResponse;
    var mockNext;
    var whenContentIsReturned;

    beforeEach(function() {
        mockResponse = {
            send: jasmine.createSpy("response.send"),
            status: jasmine.createSpy("response.status").and.callFake(function() {
                return mockResponse;
            })
        };

        mockNext = jasmine.createSpy();
    });

    describe("when content is returned from server app successfully", function() {

        beforeEach(function() {
            whenContentIsReturned = Promise.resolve("successful content");
        });

        it("sends back the successful content", function(done) {
            whenAppResponseReturns().lastly(function() {
                expect(mockResponse.send).toHaveBeenCalledWith("successful content");
                done();
            });
        });

    });

    describe("when content is returned from server app UNsuccessfully", function() {

        describe("when the server app returns a rejected promise", function() {

            beforeEach(function() {
                whenContentIsReturned = Promise.reject({
                    html: "unsuccessful content",
                    status: 403
                });
            });

            it("sends back the successful content", function(done) {
                whenAppResponseReturns().lastly(function() {
                    expect(mockResponse.status).toHaveBeenCalledWith(403);
                    expect(mockResponse.send).toHaveBeenCalledWith("unsuccessful content");
                    done();
                });
            });

        });

        describe("when the server app unexpectedly sends the error", function() {

            var error;

            beforeEach(function() {
                error = new Error();
                whenContentIsReturned = Promise.reject(error);
                spyOn(Errors, "notify");
            });

            it("does NOT send back a response", function(done) {
                whenAppResponseReturns().lastly(function() {
                    expect(mockResponse.send).not.toHaveBeenCalled();
                    done();
                });
            });

            it("sets the response to 500", function(done) {
                whenAppResponseReturns().lastly(function() {
                    expect(mockResponse.status).toHaveBeenCalledWith(500);
                    done();
                });
            });

            it("logs the error", function(done) {
                whenAppResponseReturns().lastly(function() {
                    expect(Errors.notify).toHaveBeenCalledWith(error);
                    done();
                });
            });

            it("continues to the next middleware", function(done) {
                whenAppResponseReturns().lastly(function() {
                    expect(mockNext).toHaveBeenCalled();
                    done();
                });
            });

        });

    });

    function whenAppResponseReturns() {
        return ServerResponseWorkflow.sendResponseFor(whenContentIsReturned, mockResponse, mockNext);
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
