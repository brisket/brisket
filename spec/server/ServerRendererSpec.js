"use strict";

describe("ServerRenderer", function() {
    var Backbone = require("../../lib/application/Backbone");
    var ServerRenderer = require("../../lib/server/ServerRenderer");
    var View = require("../../lib/viewing/View");
    var Layout = require("../../lib/viewing/Layout");
    var Environment = require("../../lib/environment/Environment");
    var HasPageLevelData = require("../../lib/traits/HasPageLevelData");
    var AjaxCallsForCurrentRequest = require("../../lib/server/AjaxCallsForCurrentRequest");
    var $ = require("../../lib/application/jquery");
    var _ = require("lodash");

    var view;
    var html;
    var metatags;
    var layout;
    var environmentConfig;
    var ViewWithPageLevelData;
    var mockServerRequest;

    beforeEach(function() {
        Backbone.$ = $;

        view = new Backbone.View();

        layout = new Layout();
        layout.el.innerHTML = "<html><head><title></title></head><body></body></html>";
        spyOn(layout, "setContent");
        spyOn(layout, "renderMetatags");
        spyOn(layout, "setEnvironmentConfig");
        spyOn(layout, "close");

        environmentConfig = {
            some: "environment config",
            clientAppUrl: "application.js"
        };

        ViewWithPageLevelData = Backbone.View.extend(HasPageLevelData);

        mockServerRequest = validMockServerRequest();

        spyOn(Environment, "isServer").and.returnValue(true);
        spyOn(AjaxCallsForCurrentRequest, "all");
    });

    describe("when appRoot is specified", function() {

        beforeEach(function() {
            environmentConfig.appRoot = "/subdir";
        });

        describe("when protocol is http", function() {

            beforeEach(function() {
                mockServerRequest = validMockServerRequest({
                    protocol: "http"
                });
            });

            it("injects base tag with appRoot", function() {
                html = ServerRenderer.render(layout, view, environmentConfig, null, mockServerRequest);
                expect(html).toMatch(/<base href='http:\/\/host.com\/subdir\/'>/);
            });

        });

        describe("when protocol is https", function() {

            beforeEach(function() {
                mockServerRequest = validMockServerRequest({
                    protocol: "https"
                });
            });

            it("injects base tag with appRoot", function() {
                html = ServerRenderer.render(layout, view, environmentConfig, null, mockServerRequest);
                expect(html).toMatch(/<base href='https:\/\/host.com\/subdir\/'>/);
            });

        });

    });

    describe("when appRoot is NOT specified", function() {

        beforeEach(function() {
            delete environmentConfig.appRoot;
        });

        describe("when protocol is http", function() {

            beforeEach(function() {
                mockServerRequest = validMockServerRequest({
                    protocol: "http"
                });
            });

            it("injects base tag WITHOUT appRoot", function() {
                html = ServerRenderer.render(layout, view, environmentConfig, null, mockServerRequest);
                expect(html).toMatch(/<base href='http:\/\/host.com\/'>/);
            });

        });

        describe("when protocol is https", function() {

            beforeEach(function() {
                mockServerRequest = validMockServerRequest({
                    protocol: "https"
                });
            });

            it("injects base tag WITHOUT appRoot", function() {
                html = ServerRenderer.render(layout, view, environmentConfig, null, mockServerRequest);
                expect(html).toMatch(/<base href='https:\/\/host.com\/'>/);
            });

        });

    });

    describe("when layout has a body", function() {

        it("injects the client app start up script", function() {
            html = ServerRenderer.render(layout, view, environmentConfig, "app/ClientApp", mockServerRequest);

            expect(html).toMatch(clientStartScript(environmentConfig, "app/ClientApp", null, "application.js"));
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
                    html = ServerRenderer.render(layout, view, environmentConfig, "app/ClientApp", mockServerRequest);

                    expect(html).toMatch(clientStartScript(environmentConfig, "app/ClientApp", bootstrappedData, "application.js"));
                });

                describe("when there are illegal characters environmentConfig and bootstrappedData", function() {

                    beforeEach(function() {
                        environmentConfig = {
                            some: "environment\u2028 con\u2029fig",
                            clientAppUrl: "application.js"
                        };

                        bootstrappedData = {
                            "/url": {
                                some: "da\u2028\u2029ta"
                            }
                        };
                    });

                    it("removes illegal characters in the client start script", function() {
                        html = ServerRenderer.render(layout, view, environmentConfig, "app/ClientApp", mockServerRequest);

                        expect(html).toMatch(clientStartScript(environmentConfig, "app/ClientApp", bootstrappedData, "application.js"));
                    });

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
                    html = ServerRenderer.render(layout, view, environmentConfig, "app/ClientApp", mockServerRequest);

                    escapedBootstrappedData = bootstrappedData;
                    escapedBootstrappedData["/url"].body = "<script type='text/javascript' src='some.js'><\\/script>";

                    expect(html).toMatch(clientStartScript(environmentConfig, "app/ClientApp", escapedBootstrappedData, "application.js"));
                });

            });

        });

    });

    describe("when view is Brisket.View", function() {

        beforeEach(function() {
            view = new View();
            spyOn(view, "setUid");
            ServerRenderer.render(layout, view, null, null, mockServerRequest);
        });

        it("sets uid to reflect initial request and it's creation order", function() {
            expect(view.setUid).toHaveBeenCalledWith("1|0_0");
        });

    });

    describe("when view is NOT Brisket.View", function() {

        it("does NOT throw", function() {
            function renderingBackboneView() {
                ServerRenderer.render(layout, view, null, null, mockServerRequest);
            }

            expect(renderingBackboneView).not.toThrow();
        });

    });

    describe("when view has a page level data", function() {

        beforeEach(function() {
            metatags = {
                description: "description"
            };

            view = new ViewWithPageLevelData()
                .withTitle("Title")
                .withMetatags(metatags);

            ServerRenderer.render(layout, view, null, null, mockServerRequest);
        });

        it("renders layout metatags", function() {
            expect(layout.renderMetatags).toHaveBeenCalledWith(metatags);
        });

        it("sets the layout content", function() {
            expect(layout.setContent).toHaveBeenCalledWith(view);
        });

    });

    describe("when view does NOT have page level data", function() {

        beforeEach(function() {
            ServerRenderer.render(layout, view, null, null, mockServerRequest);
        });

        it("renders the layout metatags with null", function() {
            expect(layout.renderMetatags).toHaveBeenCalledWith(null);
        });

        it("sets the layout content", function() {
            expect(layout.setContent).toHaveBeenCalledWith(view);
        });

    });

    describe("rendering page title", function() {

        describe("when layout template has title tag without attributes", function() {

            it("renders title from view's page level data", function() {
                layout.defaultTitle = "Default Title";
                view = new ViewWithPageLevelData().withTitle("Title");
                html = ServerRenderer.render(layout, view, null, null, mockServerRequest);

                expect(html).toMatch(/<title>Title<\/title>/mi);
            });

            it("renders layout's defaultTitle when view does NOT have page level data", function() {
                layout.defaultTitle = "Default Title";
                html = ServerRenderer.render(layout, view, null, null, mockServerRequest);

                expect(html).toMatch(/<title>Default Title<\/title>/mi);
            });

            it("does NOT render title when view does NOT have page level data NOR layout has defaultTitle", function() {
                html = ServerRenderer.render(layout, view, null, null, mockServerRequest);

                expect(html).toMatch(/<title><\/title>/mi);
            });

            it("escapes title for use in html", function() {
                layout.defaultTitle = "Title \" ' & < > $ $$ $' $` $& $3";
                html = ServerRenderer.render(layout, view, null, null, mockServerRequest);

                expect(html).toMatch(/<title>Title &quot; &#39; &amp; &lt; &gt; \$ \$\$ \$&#39; \$` \$&amp; \$3<\/title>/mi);
            });

            it("renders title when title tag is on multiple lines", function() {
                layout.el.innerHTML = "<html><head><title>\n</title></head><body></body></html>";
                layout.defaultTitle = "Default Title";
                html = ServerRenderer.render(layout, view, null, null, mockServerRequest);

                expect(html).toMatch(/<title>Default Title<\/title>/mi);
            });

        });

        describe("when layout template has title tag with attributes", function() {

            beforeEach(function() {
                layout.el.innerHTML = "<html><head><title class='klass'></title></head><body></body></html>";
            });

            it("renders title from view's page level data", function() {
                layout.defaultTitle = "Default Title";
                view = new ViewWithPageLevelData().withTitle("Title");
                html = ServerRenderer.render(layout, view, null, null, mockServerRequest);

                expect(html).toMatch(/<title class="klass">Title<\/title>/mi);
            });

            it("renders layout's defaultTitle when view does NOT have page level data", function() {
                layout.defaultTitle = "Default Title";
                html = ServerRenderer.render(layout, view, null, null, mockServerRequest);

                expect(html).toMatch(/<title class="klass">Default Title<\/title>/mi);
            });

            it("does NOT render title when view does NOT have page level data NOR layout has defaultTitle", function() {
                html = ServerRenderer.render(layout, view, null, null, mockServerRequest);

                expect(html).toMatch(/<title class="klass"><\/title>/mi);
            });

            it("escapes title for use in html", function() {
                layout.defaultTitle = "Title \" ' & < > $ $$ $' $` $& $3";
                html = ServerRenderer.render(layout, view, null, null, mockServerRequest);

                expect(html).toMatch(/<title class="klass">Title &quot; &#39; &amp; &lt; &gt; \$ \$\$ \$&#39; \$` \$&amp; \$3<\/title>/mi);
            });

            it("renders title when title tag is on multiple lines", function() {
                layout.el.innerHTML = "<html><head><title class='klass'>\n</title></head><body></body></html>";
                layout.defaultTitle = "Default Title";
                html = ServerRenderer.render(layout, view, null, null, mockServerRequest);

                expect(html).toMatch(/<title class="klass">Default Title<\/title>/mi);
            });

        });

    });

    function clientStartScript(environmentConfig, clientAppPath, bootstrappedData, clientAppUrl) {
        var pattern = "<script type=\"text/javascript\">\n" +
            "var s = document.createElement\\(\"script\"\\);\n" +
            "var h = document.head;\n" +
            "s.setAttribute\\(\"src\", \"" + clientAppUrl + "\"\\);\n" +
            "function loaded\\(e\\) {\n" +
            "var ClientApp = require\\('" + clientAppPath + "'\\);\n" +
            "var clientApp = new ClientApp\\(\\);\n" +
            "clientApp.start\\({\n" +
            "environmentConfig: " + stringifyData(environmentConfig) + ",\n" +
            "bootstrappedData: " + stringifyData(bootstrappedData) + "\n" +
            "}\\);\n" +
            "s.removeEventListener\\(\"load\", loaded, false\\);\n" +
            "s = null;\n" +
            "}\n" +
            "s.addEventListener\\(\"load\", loaded\\);\n" +
            "setTimeout\\(function\\(\\){\n" +
            "h.insertBefore\\(s, null\\);\n" +
            "h = null;\n" +
            "},0\\);\n" +
            "</script>";

        return new RegExp(stripIllegalCharacters(pattern), "m");
    }

    function stringifyData(data) {
        return JSON.stringify(data || {});
    }

    function stripIllegalCharacters(input) {
        return input.replace(/\u2028|\u2029/g, '');
    }

    function validMockServerRequest(props) {
        return _.extend({
            host: "host.com",
            protocol: "https"
        }, props);
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
