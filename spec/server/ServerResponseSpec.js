"use strict";

describe("ServerResponse", function() {
    var ServerResponse = require("../../lib/server/ServerResponse");

    var serverResponse;

    beforeEach(function() {
        serverResponse = new ServerResponse();
    });

    describe("#set", function() {

        it("sets header by field and value", function() {
            serverResponse.set("Cache-control", "must-revalidate");

            expect(serverResponse.headers).toEqual(jasmine.objectContaining({
                "Cache-control": "must-revalidate"
            }));
        });

        it("sets headers by object with field/value pairs", function() {
            serverResponse.set({
                "Cache-control": "private",
                "Vary": "Accept-Encoding"
            });

            expect(serverResponse.headers).toEqual(jasmine.objectContaining({
                "Cache-control": "private",
                "Vary": "Accept-Encoding"
            }));
        });

    });

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
