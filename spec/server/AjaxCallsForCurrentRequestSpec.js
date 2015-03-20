"use strict";

describe("AjaxCallsForCurrentRequest", function() {
    var AjaxCallsForCurrentRequest = require("../../lib/server/AjaxCallsForCurrentRequest");
    var DomainLocalStorage = require("../../lib/server/DomainLocalStorage");

    beforeEach(function() {
        var fakeStorage = {};

        spyOn(DomainLocalStorage, "get").and.callFake(function(a) {
            return fakeStorage[a];
        });

        spyOn(DomainLocalStorage, "set").and.callFake(function(a, b) {
            fakeStorage[a] = b;
        });
    });

    describe("when query params are NOT given", function() {

        beforeEach(function() {
            AjaxCallsForCurrentRequest.record("/url", undefined, {
                some: "data"
            });
        });

        it("records url and data", function() {
            expect(AjaxCallsForCurrentRequest.all()).toEqual(jasmine.objectContaining({
                "/url": {
                    some: "data"
                }
            }));
        });

        itCanClearAllRecordedAjaxCallsForCurrentRequest();

    });

    describe("when query params are given", function() {

        beforeEach(function() {
            AjaxCallsForCurrentRequest.record("/url", {
                query: "param"
            }, {
                some: "data"
            });
        });

        it("records url+params and data", function() {
            expect(AjaxCallsForCurrentRequest.all()).toEqual(jasmine.objectContaining({
                '/url{"query":"param"}': {
                    some: "data"
                }
            }));
        });

        itCanClearAllRecordedAjaxCallsForCurrentRequest();

    });

    function itCanClearAllRecordedAjaxCallsForCurrentRequest() {
        it("clears all recorded ajax calls for current request", function() {
            AjaxCallsForCurrentRequest.clear();
            expect(AjaxCallsForCurrentRequest.all()).toBeNull();
        });
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
