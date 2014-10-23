"use strict";

var Backbone = require("../../lib/application/Backbone");
var ServerRenderer = require("../../lib/server/ServerRenderer");
var View = require("../../lib/viewing/View");
var Layout = require("../../lib/viewing/Layout");
var Environment = require("../../lib/environment/Environment");
var HasPageLevelData = require("../../lib/traits/HasPageLevelData");
var AjaxCallsForCurrentRequest = require("../../lib/server/AjaxCallsForCurrentRequest");
var $ = require("../../lib/application/jquery");

describe("ServerRenderer", function() {
    var host;
    var view;
    var html;
    var metatags;
    var layout;
    var environmentConfig;
    var onRender;
    var ViewWithPageLevelData;
    var request;

    beforeEach(function() {
        Backbone.$ = $;

        host = "host.com";
        view = new Backbone.View();

        layout = new Layout();
        layout.el.innerHTML = "<html><head><title></title></head><body></body></html>";
        spyOn(layout, "setContent");
        spyOn(layout, "setTitle");
        spyOn(layout, "setMetaTags");
        spyOn(layout, "setEnvironmentConfig");
        spyOn(layout, "close");

        environmentConfig = {
            some: "environment config"
        };

        onRender = jasmine.createSpy();

        ViewWithPageLevelData = Backbone.View.extend(HasPageLevelData);

        request = {
            protocol: "https"
        };

        spyOn(Environment, "isServer").and.returnValue(true);
        spyOn(AjaxCallsForCurrentRequest, "all");
    });

    describe("when appRoot is specified", function() {

        beforeEach(function() {
            environmentConfig.appRoot = "/subdir";
        });

        describe("when protocol is http", function() {

            beforeEach(function() {
                request = {
                    protocol: "http"
                };
            });

            it("injects base tag with appRoot", function() {
                html = ServerRenderer.render(layout, view, null, host, environmentConfig, null, request);
                expect(html).toMatch(/<base href="http:\/\/host.com\/subdir\/">/);
            });

        });

        describe("when protocol is https", function() {

            beforeEach(function() {
                request = {
                    protocol: "https"
                };
            });

            it("injects base tag with appRoot", function() {
                html = ServerRenderer.render(layout, view, null, host, environmentConfig, null, request);
                expect(html).toMatch(/<base href="https:\/\/host.com\/subdir\/">/);
            });

        });

    });

    describe("when appRoot is NOT specified", function() {

        beforeEach(function() {
            delete environmentConfig.appRoot;
        });

        describe("when protocol is http", function() {

            beforeEach(function() {
                request = {
                    protocol: "http"
                };
            });

            it("injects base tag WITHOUT appRoot", function() {
                html = ServerRenderer.render(layout, view, null, host, environmentConfig, null, request);
                expect(html).toMatch(/<base href="http:\/\/host.com\/">/);
            });

        });

        describe("when protocol is https", function() {

            beforeEach(function() {
                request = {
                    protocol: "https"
                };
            });

            it("injects base tag WITHOUT appRoot", function() {
                html = ServerRenderer.render(layout, view, null, host, environmentConfig, null, request);
                expect(html).toMatch(/<base href="https:\/\/host.com\/">/);
            });

        });

    });

    describe("when layout has a body", function() {

        it("injects the client app start up script", function() {
            html = ServerRenderer.render(layout, view, null, host, environmentConfig, "app/ClientApp", request);

            expect(html).toMatch(clientStartScript(environmentConfig, "app/ClientApp", null));
        });

        describe("when there is bootstrappedData from Backbone ajax requests during the request", function() {
            var bootstrappedData;

            describe("when bootstrappedData does NOT have script tag", function() {

                beforeEach(function() {
                    bootstrappedData = {
                        "/url": {
                            some: "data"
                        }
                    };
                    AjaxCallsForCurrentRequest.all.and.returnValue(bootstrappedData);
                });

                it("injects the bootstrappedData into the client app start up script", function() {
                    html = ServerRenderer.render(layout, view, null, host, environmentConfig, "app/ClientApp", request);

                    expect(html).toMatch(clientStartScript(environmentConfig, "app/ClientApp", bootstrappedData));
                });

            });

            describe("when bootstrappedData has script tag", function() {
                var escapedBootstrappedData;

                beforeEach(function() {
                    bootstrappedData = {
                        "/url": {
                            body: "<script type='text/javascript' src='some.js'></script>"
                        }
                    };

                    AjaxCallsForCurrentRequest.all.and.returnValue(bootstrappedData);
                });

                it("escapes <script> closing tags", function() {
                    html = ServerRenderer.render(layout, view, null, host, environmentConfig, "app/ClientApp", request);

                    escapedBootstrappedData = bootstrappedData;
                    escapedBootstrappedData["/url"].body = "<script type='text/javascript' src='some.js'><\\/script>";

                    expect(html).toMatch(clientStartScript(environmentConfig, "app/ClientApp", escapedBootstrappedData));
                });

            });

        });

    });

    describe("when layout does NOT have a body", function() {

        beforeEach(function() {
            layout.el.innerHTML = "<html><head></head></html>";
        });

        it("does NOT inject the client app start script", function() {
            html = ServerRenderer.render(layout, view, null, host, environmentConfig, "app/ClientApp", request);

            expect(html).not.toMatch(clientStartScript(environmentConfig, "app/ClientApp", null));
        });

    });

    describe("when an onRender function is passed", function() {

        it("calls the onRender function", function() {
            html = ServerRenderer.render(layout, view, onRender, host, null, null, request);
            expect(onRender).toHaveBeenCalled();
            expect(onRender).toHaveBeenCalledWith(layout);
        });

    });

    describe("exposing environment config to the layout", function() {

        beforeEach(function() {
            html = ServerRenderer.render(layout, view, null, host, environmentConfig, "app/ClientApp", request);
        });

        it("sets the layout environmentConfig", function() {
            expect(layout.setEnvironmentConfig).toHaveBeenCalledWith(environmentConfig);
        });

    });

    describe("when view is Brisket.View", function() {

        beforeEach(function() {
            view = new View();
            spyOn(view, "setUid");
            ServerRenderer.render(layout, view, onRender, host, null, null, request);
        });

        it("sets uid to reflect initial request and it's creation order", function() {
            expect(view.setUid).toHaveBeenCalledWith("1|0_0");
        });

    });

    describe("when view is NOT Brisket.View", function() {

        it("does NOT throw", function() {
            function renderingBackboneView() {
                ServerRenderer.render(layout, view, onRender, host, null, null, request);
            }

            expect(renderingBackboneView).not.toThrow();
        });

    });

    describe("when view has a page level data", function() {

        beforeEach(function() {
            metatags = new Layout.Metatags({
                description: "description"
            });

            view = new ViewWithPageLevelData()
                .withTitle("Title")
                .withMetatags(metatags);

            ServerRenderer.render(layout, view, onRender, host, null, null, request);
        });

        it("sets the layout title", function() {
            expect(layout.setTitle).toHaveBeenCalledWith("Title");
        });

        it("sets the layout metatags", function() {
            expect(layout.setMetaTags).toHaveBeenCalledWith(metatags);
        });

        it("sets the layout content", function() {
            expect(layout.setContent).toHaveBeenCalledWith(view);
        });

    });

    describe("when view does NOT have page level data", function() {

        beforeEach(function() {
            ServerRenderer.render(layout, view, onRender, host, null, null, request);
        });

        it("sets the layout title with null", function() {
            expect(layout.setTitle).toHaveBeenCalledWith(null);
        });

        it("sets the layout metatags with null", function() {
            expect(layout.setMetaTags).toHaveBeenCalledWith(null);
        });

        it("sets the layout content", function() {
            expect(layout.setContent).toHaveBeenCalledWith(view);
        });

    });

    function clientStartScript(environmentConfig, clientAppPath, bootstrappedData) {

        return new RegExp(
            "<script type=\"text/javascript\">\n" +
            "var ClientApp = require\\('" + clientAppPath + "'\\);\n" +
            "var clientApp = new ClientApp\\(\\);\n" +
            "clientApp.start\\({\n" +
            "environmentConfig: " + stringifyData(environmentConfig) + ",\n" +
            "bootstrappedData: " + stringifyData(bootstrappedData) + "\n" +
            "}\\);\n" +
            "</script>",

            "m"
        );
    }

    function stringifyData(data) {
        return JSON.stringify(data || {});
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
