"use strict";

describe("ServerResponseWorkflow", function() {
    var ServerResponseWorkflow = require("../../lib/server/ServerResponseWorkflow");
    var ServerResponse = require("../../lib/server/ServerResponse");
    var Response = require("../../lib/controlling/Response");
    var Promise = require("bluebird");

    var mockExpressResponse;
    var mockNext;
    var whenContentIsReturned;
    var serverResponse;
    var error;

    beforeEach(function() {
        serverResponse = new ServerResponse();

        mockExpressResponse = {
            send: jasmine.createSpy("response.send"),
            set: jasmine.createSpy("response.set"),
            status: jasmine.createSpy("response.status").and.callFake(function() {
                return mockExpressResponse;
            }),
            redirect: jasmine.createSpy("response.redirect")
        };

        mockNext = jasmine.createSpy();
    });

    afterEach(unsetAppRoot);

    describe("when content is returned from server app successfully", function() {

        it("sends back the successful content", function(done) {
            whenAppResponseReturnsSuccessfully(function() {
                expect(mockExpressResponse.status).toHaveBeenCalledWith(200);
                expect(mockExpressResponse.send).toHaveBeenCalledWith("successful content");
                done();
            });
        });

        it("sets response headers from route", function(done) {
            serverResponse.set("Cache-control", "public, max-age=4200");

            whenAppResponseReturnsSuccessfully(function() {
                expect(mockExpressResponse.set).toHaveBeenCalledWith({
                    "Cache-control": "public, max-age=4200"
                });

                done();
            });
        });

    });

    describe("when custom status code is requested", function() {

        beforeEach(function() {
            serverResponse.status(204);
        });

        it("sends back the successful content", function(done) {
            whenAppResponseReturnsSuccessfully(function() {
                expect(mockExpressResponse.status).toHaveBeenCalledWith(204);
                expect(mockExpressResponse.send).toHaveBeenCalledWith("successful content");
                done();
            });
        });

    });

    describe("when app requests redirect", function() {

        it("does NOT response.send", function(done) {
            givenAnyRedirect();

            whenAppResponseReturnsSuccessfully(function() {
                expect(mockExpressResponse.send).not.toHaveBeenCalled();
                done();
            });
        });

        it("redirects to application paths WITHOUT appRoot set", function(done) {
            givenRedirectWithApplicationPath();

            whenAppResponseReturnsSuccessfully(function() {
                expect(mockExpressResponse.redirect).toHaveBeenCalledWith(302, "/somewhere/in/app");
                done();
            });
        });

        it("redirects to application paths WITH appRoot set", function(done) {
            givenAppRootSet();
            givenRedirectWithApplicationPath();

            whenAppResponseReturnsSuccessfully(function() {
                expect(mockExpressResponse.redirect).toHaveBeenCalledWith(302, "/appRoot/somewhere/in/app");
                done();
            });
        });

        it("redirects to absolute paths WITHOUT appRoot set", function(done) {
            givenRedirectWithAbsolutePath();

            whenAppResponseReturnsSuccessfully(function() {
                expect(mockExpressResponse.redirect).toHaveBeenCalledWith(302, "/somewhere/in/app");
                done();
            });
        });

        it("redirects to absolute paths WITH appRoot set", function(done) {
            givenAppRootSet();
            givenRedirectWithAbsolutePath();

            whenAppResponseReturnsSuccessfully(function() {
                expect(mockExpressResponse.redirect).toHaveBeenCalledWith(302, "/somewhere/in/app");
                done();
            });
        });

        it("redirects to fully qualified urls WITHOUT appRoot set", function(done) {
            givenRedirectWithFullyQualifiedUrl();

            whenAppResponseReturnsSuccessfully(function() {
                expect(mockExpressResponse.redirect).toHaveBeenCalledWith(302, "http://www.fullyqualified.com");
                done();
            });
        });

        it("redirects to fully qualified urls WITH appRoot set", function(done) {
            givenAppRootSet();
            givenRedirectWithFullyQualifiedUrl();

            whenAppResponseReturnsSuccessfully(function() {
                expect(mockExpressResponse.redirect).toHaveBeenCalledWith(302, "http://www.fullyqualified.com");
                done();
            });
        });

    });

    describe("when redirect with custom status had been requested", function() {

        it("redirects to requested destination with custom status", function(done) {
            givenRedirectWithCustomStatus();

            whenAppResponseReturnsSuccessfully(function() {
                expect(mockExpressResponse.redirect).toHaveBeenCalledWith(301, "/redirect/with/status");
                done();
            });
        });

    });

    describe("when content is returned from server app UNsuccessfully", function() {

        describe("when the server app handles an error", function() {

            beforeEach(function() {
                serverResponse.status(403);
            });

            it("does NOT set response headers from route", function(done) {
                serverResponse.set("Cache-control", "private, max-age=5600");

                whenAppHandlesError(function() {
                    expect(mockExpressResponse.set).not.toHaveBeenCalled();
                    done();
                });
            });

            it("sends back the UNsuccessful content", function(done) {
                whenAppHandlesError(function() {
                    expect(mockExpressResponse.send).toHaveBeenCalledWith("unsuccessful content");
                    done();
                });
            });

            it("sends back the error code", function(done) {
                whenAppHandlesError(function() {
                    expect(mockExpressResponse.status).toHaveBeenCalledWith(403);
                    done();
                });
            });

        });

        describe("when the server app CANNOT handle an error", function() {

            it("does NOT send back a response", function(done) {
                whenAppCannotHandleError(function() {
                    expect(mockExpressResponse.send).not.toHaveBeenCalled();
                    done();
                });
            });

            it("continues to the next middleware with error", function(done) {
                whenAppCannotHandleError(function() {
                    expect(mockNext).toHaveBeenCalledWith(error);
                    done();
                });
            });

        });

    });

    function sendResponse() {
        return ServerResponseWorkflow.sendResponseFor(whenContentIsReturned, mockExpressResponse, mockNext);
    }

    function whenAppResponseReturnsSuccessfully(expectThings) {
        whenContentIsReturned = Promise.resolve({
            html: "successful content",
            serverResponse: serverResponse
        });

        return sendResponse()
            .finally(expectThings);
    }

    function whenAppHandlesError(expectThings) {
        whenContentIsReturned = Promise.reject({
            html: "unsuccessful content",
            serverResponse: serverResponse
        });

        return sendResponse()
            .finally(expectThings);
    }

    function whenAppCannotHandleError(expectThings) {
        error = new Error();
        whenContentIsReturned = Promise.reject(error);

        return sendResponse()
            .finally(expectThings);
    }

    function redirectWithStatus(status, destination) {
        try {
            serverResponse.redirect(status, destination);
        } catch (e) {}
    }

    function redirectTo(destination) {
        try {
            serverResponse.redirect(destination);
        } catch (e) {}
    }

    function givenAnyRedirect() {
        givenRedirectWithApplicationPath();
    }

    function givenRedirectWithCustomStatus() {
        redirectWithStatus(301, "/redirect/with/status");
    }

    function givenRedirectWithApplicationPath() {
        redirectTo("somewhere/in/app");
    }

    function givenRedirectWithAbsolutePath() {
        redirectTo("/somewhere/in/app");
    }

    function givenRedirectWithFullyQualifiedUrl() {
        redirectTo("http://www.fullyqualified.com");
    }

    function givenAppRootSet() {
        Response.setAppRoot("/appRoot");
        serverResponse = new ServerResponse();
    }

    function unsetAppRoot() {
        Response.setAppRoot("");
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
