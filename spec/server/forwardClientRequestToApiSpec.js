"use strict";

var forwardClientRequestToApiSpec = require("../../lib/server/forwardClientRequestToApi");

describe("forwardClientRequestToApi", function() {

    it("returns a middleware handler", function(){
        var result = forwardClientRequestToApiSpec('localhost');
        expect(typeof(result)).toBe("function");
    });

    describe("middleware handler", function() {
        var apiHost = 'localhost';
        var middlewareHandler = forwardClientRequestToApiSpec(apiHost);

        it("should call next if header is not set", function(){
            var next = jasmine.createSpy('next');
            middlewareHandler({headers: {}},{},next);
            expect(next).toHaveBeenCalled();
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
