"use strict";

var App = require("lib/application/App");
var Backbone = require("lib/application/Backbone");
var Routers = require("lib/controlling/Routers");

describe("App", function() {
    var ExampleApp;
    var app;
    var valueToInspectStart;
    var testConfig;

    beforeEach(function() {
        valueToInspectStart = false;
    });

    describe("as base class", function() {

        describe("when extended App has a 'start' property that is NOT a function", function() {

            it("throws an error on construction", function() {
                var creatingAppWithNonFunctionStartProperty = function() {
                    ExampleApp = App.extend({
                        start: "not a function"
                    });
                };

                expect(creatingAppWithNonFunctionStartProperty).toThrow();
            });

        });

        describe("when extended App has a class in it's hierarchy that is missing a start method", function() {
            var AppWithParentMissingStart;

            beforeEach(function() {
                ExampleApp = App.extend();
                AppWithParentMissingStart = ExampleApp.extend({
                    start: function() {
                        valueToInspectStart = true;
                    }
                });

                app = new AppWithParentMissingStart();
            });

            it("does not throw an error when start is called", function() {
                var callingStartOnAppWhoseParentIsMissingStart = function() {
                    app.start();
                };

                expect(callingStartOnAppWhoseParentIsMissingStart).not.toThrow();
            });

            it("executes available start method bodies", function() {
                spyOn(App.prototype, "start").and.callThrough();

                app.start();

                expect(App.prototype.start).toHaveBeenCalled();
                expect(App.prototype.start.calls.count()).toBe(1);
                expect(valueToInspectStart).toEqual(true);
            });

        });

        describe("when extended App does not specify a start method", function() {

            beforeEach(function() {
                ExampleApp = App.extend();

                app = new ExampleApp();
            });

            it("does not throw an error", function() {
                var callingStartOnAppWithNoStartMethod = function() {
                    app.start();
                };

                expect(callingStartOnAppWithNoStartMethod).not.toThrow();
            });

            it("executes available start method bodies", function() {
                spyOn(App.prototype, "start").and.callThrough();

                app.start();

                expect(App.prototype.start).toHaveBeenCalled();
            });

        });

        describe("when extended App has a start method", function() {

            var originalStart;

            beforeEach(function() {
                originalStart = jasmine.createSpy().and.callFake(function() {
                    valueToInspectStart = true;
                });

                ExampleApp = App.extend({
                    start: originalStart
                });

                app = new ExampleApp();
            });

            describe("extended #start", function() {

                beforeEach(function() {
                    testConfig = {
                        x: 1
                    };

                    spyOn(app, "start").and.callThrough();
                    app.start(testConfig);
                });

                it("passes config to start when present", function() {
                    expect(originalStart).toHaveBeenCalledWith(testConfig);
                });

                it("can be extended", function() {
                    expect(App.extend().toString()).toEqual(Backbone.Model.extend().toString());
                });

                it("seamlessly chains overridden start with base start", function() {
                    spyOn(App.prototype, "start").and.callThrough();

                    app.start();

                    expect(App.prototype.start).toHaveBeenCalled();
                    expect(valueToInspectStart).toEqual(true);
                });

                it("properly passes config to overridden start", function() {
                    var serverConfig = {
                        "some": "setting"
                    };

                    ExampleApp = App.extend({
                        start: function() {}
                    });

                    var app = new ExampleApp();

                    spyOn(app, "start");

                    app.start(serverConfig);

                    expect(app.start).toHaveBeenCalledWith(serverConfig);
                });

                describe("router setup", function() {

                    describe("when routers have been set", function() {
                        var AppWithRouter;
                        var appWithRouter;
                        var routersValue;

                        beforeEach(function() {

                            routersValue = Routers.toUse({
                                routers: [Backbone.Router]
                            });

                            AppWithRouter = App.extend({
                                routers: routersValue
                            });

                            appWithRouter = new AppWithRouter();

                            spyOn(appWithRouter.routers, "init");
                            appWithRouter.start();
                        });

                    });

                    describe("when routes have NOT been set", function() {
                        var AppWithoutRouters;
                        var appWithoutRouters;

                        beforeEach(function() {
                            AppWithoutRouters = App.extend();

                            appWithoutRouters = new AppWithoutRouters();
                        });

                        it("does not set or initializes routers", function() {
                            expect(appWithoutRouters.routers).toBe(null);
                        });

                        it("does not throw", function() {
                            var initializingWithoutRouters = function() {
                                appWithoutRouters.start();
                            };

                            expect(initializingWithoutRouters).not.toThrow();
                        });

                    });

                });

            });

        });

    });

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
