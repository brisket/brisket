"use strict";

describe("ClientResponse", function() {
    var ClientResponse = require("../../../lib/client/ClientResponse");
    var Response = require("../../../lib/controlling/Response");
    var mockWindow = require("../../mock/mockWindow");

    var clientResponse;
    var windough;

    beforeEach(function() {
        windough = mockWindow();
        clientResponse = ClientResponse.from(windough);
    });

    afterEach(unsetAppRoot);

    it("does NOT error when you call ClientResponse#status", function() {
        expect(function() {
            clientResponse.status(204);
        }).not.toThrow();
    });

    it("does NOT error when you call ClientResponse#set", function() {
        expect(function() {
            clientResponse.set("key", "value");
            clientResponse.set({
                "key2": "value2",
                "key3": "value3"
            });
        }).not.toThrow();
    });

    it("does NOT error when you call ClientResponse#noStartupScript", function() {
        expect(function() {
            clientResponse.noStartupScript();
        }).not.toThrow();
    });

    describe("#redirect", function() {

        it("redirects to application path WITHOUT appRoot set", function() {
            whenRedirectWithApplicationPath();

            expect(windough.location.replace).toHaveBeenCalledWith("/somewhere/in/app");
        });

        it("redirects to application path WITH appRoot set", function() {
            givenAppRootSet();
            whenRedirectWithApplicationPath();

            expect(windough.location.replace).toHaveBeenCalledWith("/appRoot/somewhere/in/app");
        });

        it("redirects to absolute path WITHOUT appRoot set", function() {
            whenRedirectWithAbsolutePath();

            expect(windough.location.replace).toHaveBeenCalledWith("/somewhere/in/app");
        });

        it("redirects to absolute path WITH appRoot set", function() {
            givenAppRootSet();
            whenRedirectWithAbsolutePath();

            expect(windough.location.replace).toHaveBeenCalledWith("/somewhere/in/app");
        });

        it("redirects to absolute path WITHOUT appRoot set", function() {
            whenRedirectWithFullyQualifiedUrl();

            expect(windough.location.replace).toHaveBeenCalledWith("http://www.fullyqualified.com");
        });

        it("redirects to absolute path WITH appRoot set", function() {
            givenAppRootSet();
            whenRedirectWithFullyQualifiedUrl();

            expect(windough.location.replace).toHaveBeenCalledWith("http://www.fullyqualified.com");
        });

        it("redirects if custom status code is passed", function() {
            whenRedirectWithCustomStatus();

            expect(windough.location.replace).toHaveBeenCalledWith("/redirect/with/status");
        });

    });

    function givenAppRootSet() {
        Response.setAppRoot("/appRoot");
        clientResponse = new ClientResponse(windough);
    }

    function whenRedirectWithCustomStatus() {
        redirectWithStatus(301, "/redirect/with/status");
    }

    function whenRedirectWithApplicationPath() {
        redirectTo("somewhere/in/app");
    }

    function whenRedirectWithAbsolutePath() {
        redirectTo("/somewhere/in/app");
    }

    function whenRedirectWithFullyQualifiedUrl() {
        redirectTo("http://www.fullyqualified.com");
    }

    function redirectTo(destination) {
        try {
            clientResponse.redirect(destination);
        } catch (e) {}
    }

    function redirectWithStatus(status, destination) {
        try {
            clientResponse.redirect(status, destination);
        } catch (e) {}
    }

    function unsetAppRoot() {
        Response.setAppRoot("");
    }

});

// ----------------------------------------------------------------------------
// Copyright (C) 2017 Bloomberg Finance L.P.
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
