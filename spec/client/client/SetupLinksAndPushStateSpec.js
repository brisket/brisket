"use strict";

var SetupLinksAndPushState = require("lib/client/SetupLinksAndPushState");
var Url = require("lib/util/Url");
var ClientRequest = require("lib/client/ClientRequest");
var Backbone = require("lib/application/Backbone");
var $ = require("lib/application/jquery");

describe("SetupLinksAndPushState", function() {
    var $fixture;

    beforeEach(function() {
        spyOn(Url, "location").andReturn({
            href: "http://www.bloombergview.com/aRoute",
            pathname: "/aRoute"
        });

        spyOn(Backbone.history, "start");
        spyOn(Backbone.history, "loadUrl");
        spyOn(Backbone.history, "navigate");
        spyOn(Backbone.history, "getFragment").andReturn("aRoute");

        spyOn(ClientRequest, "isFromLinkClick");

        $fixture = $(
            '<div class="clienthistory_links">' +
            '<a class="applink" href="somewhere/inapp">' +
            'I am an application link because my path is relative NOT because of class name.' +
            'Class name is just there for testing ease.' +
            '</a>' +
            '<a href="#top">I am a hash link</a>' +
            '<a href="http://www.somewhere.com">I am a fully qualified url link</a>' +
            '<a href="/absolute/path/link">I am an absolute path link</a>' +
            '<a href="mailto:someone@example.com">I am a mailto link</a>' +
            '<a href="javascript:{}">I am a link with javascript code</a>' +
            '</div>'
        ).appendTo("body");
    });

    afterEach(function() {
        SetupLinksAndPushState.stop();
        $fixture.remove();
    });

    describe("when starting with pushState", function() {

        beforeEach(function() {
            SetupLinksAndPushState.start({
                root: "",
                pushState: true
            });
        });

        it("starts Backbone history", function() {
            expect(Backbone.history.start).toHaveBeenCalled();
        });

        it("starts Backbone history with pushState enabled", function() {
            expect(Backbone.history.start.mostRecentCall.args[0])
                .toHaveKeyValue("pushState", true);
        });

        it("starts Backbone history silently", function() {
            expect(Backbone.history.start.mostRecentCall.args[0])
                .toHaveKeyValue("silent", true);
        });

        it("loads the correct route", function() {
            expect(Backbone.history.loadUrl).toHaveBeenCalledWith("aRoute");
        });

        it("sets up application links to navigate Backbone history", function() {
            $fixture.find("a.applink").click();

            expect(Backbone.history.navigate)
                .toHaveBeenCalledWith("somewhere/inapp", {
                    trigger: true
                });
        });

        it("sets up application links to set ClientRequest as from link click", function() {
            $fixture.find("a.applink").click();

            expect(ClientRequest.isFromLinkClick).toHaveBeenCalled();
        });

        forEach({
            "alt + click": $.Event("click", {
                altKey: true
            }),
            "ctrl + click": $.Event("click", {
                ctrlKey: true
            }),
            "meta + click": $.Event("click", {
                metaKey: true
            }),
            "shift + click": $.Event("click", {
                shiftKey: true
            })
        })
            .it("does NOT navigate Backbone history on {{a usability click}}", function(e) {
                var $link = $fixture.find("a.applink");

                expect($link).toExist();

                $link.trigger(e);

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

        forEach({
            "hash link": "#",
            "fully qualified link": "http",
            "absolute path link": "/",
            "mailto link": "mailto",
            "javascript code link": "javascript"
        })
            .it("does NOT set up {{a NON application link}} to navigate Backbone history", function(linkStartsWith) {
                var $link = $fixture.find("a[href^='" + linkStartsWith + "']");

                expect($link).toExist();

                $link.click();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

    });

    describe("when starting WITHOUT pushState", function() {

        beforeEach(function() {
            SetupLinksAndPushState.start({
                root: "",
                pushState: false
            });
        });

        it("starts Backbone history", function() {
            expect(Backbone.history.start).toHaveBeenCalled();
        });

        it("starts Backbone history with pushState disabled", function() {
            expect(Backbone.history.start.mostRecentCall.args[0])
                .toHaveKeyValue("pushState", false);
        });

        it("starts Backbone history silently", function() {
            expect(Backbone.history.start.mostRecentCall.args[0])
                .toHaveKeyValue("silent", true);
        });

        forEach({
            "application link": ".applink",
            "hash link": "[href^='#']",
            "fully qualified link": "[href^='http']",
            "absolute path link": "[href^='/']",
            "mailto link": "[href^='mailto']",
            "javascript code link": "[href^='javascript']"
        })
            .it("does NOT set up {{any link}} to navigate Backbone history", function(linkSelector) {
                var $link = $("a" + linkSelector);

                expect($link).toExist();

                $link.click();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });
    });

    describe("when setting the root", function() {

        beforeEach(function() {
            SetupLinksAndPushState.start({
                root: "some/root",
                pushState: true
            });
        });

        it("starts Backbone history", function() {
            expect(Backbone.history.start).toHaveBeenCalled();
        });

        it("starts Backbone history with pushState disabled", function() {
            expect(Backbone.history.start.mostRecentCall.args[0])
                .toHaveKeyValue("root", "some/root");
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
