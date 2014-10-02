"use strict";

var DomainLocalStorage = require("../../lib/server/DomainLocalStorage");
var createDomain = require("domain").create;

describe("DomainLocalStorage", function() {

    describe("middleware", function() {

        var request;
        var response;
        var next;

        beforeEach(function() {
            request = {};
            response = {};
            next = jasmine.createSpy();
        });

        it("binds a domain to the next middleware", function() {
            next = function() {
                expect(process.domain).toBeDefined();
            };

            DomainLocalStorage.middleware(request, response, next);
        });

        it("creates a field on the domain to store data", function() {
            next = function() {
                expect(process.domain["brisket:domainLocalStorage"]).toBeDefined();
            };

            DomainLocalStorage.middleware(request, response, next);
        });

        it("adds request as an event emitter to the domain in case it throws an error", function() {
            next = function() {
                expect(process.domain.members).toContain(request);
            };

            DomainLocalStorage.middleware(request, response, next);
        });

        it("adds response as an event emitter to the domain in case it throws an error", function() {
            next = function() {
                expect(process.domain.members).toContain(response);
            };

            DomainLocalStorage.middleware(request, response, next);
        });

        describe("when there is an active domain AND it had been created by middleware", function() {

            it("sets data onto and gets data from the active domain", function() {
                next = function() {
                    DomainLocalStorage.set("key1", "value1");
                    DomainLocalStorage.set("key2", "value2");

                    expect(DomainLocalStorage.get("key1")).toBe("value1");
                    expect(DomainLocalStorage.get("key2")).toBe("value2");

                    expect(DomainLocalStorage.getAll()).toEqual({
                        "key1": "value1",
                        "key2": "value2"
                    });
                };

                DomainLocalStorage.middleware(request, response, next);
            });

        });

        describe("when there is an active domain AND it had NOT been created by middleware", function() {

            it("cannot set data onto nor get data from the active domain", function() {
                next = function() {
                    DomainLocalStorage.set("key1", "value1");
                    DomainLocalStorage.set("key2", "value2");

                    expect(DomainLocalStorage.get("key1")).toBeNull();
                    expect(DomainLocalStorage.get("key2")).toBeNull();

                    expect(DomainLocalStorage.getAll()).toBeNull();
                };

                var domain = createDomain();

                domain.run(function() {
                    next();
                });
            });

        });

        describe("when there is NOT an active domain", function() {

            it("cannot set data onto nor get data from the active domain", function() {
                next = function() {
                    DomainLocalStorage.set("key1", "value1");
                    DomainLocalStorage.set("key2", "value2");

                    expect(DomainLocalStorage.get("key1")).toBeNull();
                    expect(DomainLocalStorage.get("key2")).toBeNull();

                    expect(DomainLocalStorage.getAll()).toBeNull();
                };

                next();
            });

        });

    });

});

// ----------------------------------------------------------------------------
// Copyright (C) 2014 Bloomberg L.P.
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
