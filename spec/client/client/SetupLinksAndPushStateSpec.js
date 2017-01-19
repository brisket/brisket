"use strict";

describe("SetupLinksAndPushState", function() {
    var SetupLinksAndPushState = require("../../../lib/client/SetupLinksAndPushState");
    var Browser = require("../../../lib/client/Browser");
    var ClientRequest = require("../../../lib/client/ClientRequest");
    var Backbone = require("../../../lib/application/Backbone");
    var $ = require("../../../lib/application/jquery");

    var $fixture;
    var $link;
    var clickEvent;

    beforeEach(function() {
        spyOn(Browser, "location").and.returnValue({
            href: "http://www.bloombergview.com/aRoute",
            pathname: "/aRoute"
        });

        spyOn(Backbone.history, "start");
        spyOn(Backbone.history, "loadUrl");
        spyOn(Backbone.history, "navigate");
        spyOn(Backbone.history, "getFragment").and.returnValue("aRoute");

        spyOn(ClientRequest, "isFromLinkClick");

        clickEvent = document.createEvent("Event");
        clickEvent.initEvent("click", true, true);
        clickEvent.view = window;

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

        $link = null;
    });

    afterEach(function() {
        SetupLinksAndPushState.stop();
        document.removeEventListener("click", preventRealClick);
        $fixture.remove();
    });

    describe("when starting with pushState", function() {

        beforeEach(function() {
            SetupLinksAndPushState.start({
                root: "",
                browserSupportsPushState: true
            });

            document.addEventListener("click", preventRealClick);
        });

        it("starts Backbone history", function() {
            expect(Backbone.history.start).toHaveBeenCalled();
        });

        it("starts Backbone history with pushState enabled", function() {
            expect(Backbone.history.start.calls.mostRecent().args[0])
                .toHaveKeyValue("pushState", true);
        });

        it("starts Backbone history silently", function() {
            expect(Backbone.history.start.calls.mostRecent().args[0])
                .toHaveKeyValue("silent", true);
        });

        it("loads the correct route", function() {
            expect(Backbone.history.loadUrl).toHaveBeenCalledWith("aRoute");
        });

        it("sets up application links to navigate Backbone history", function() {
            $link = $fixture.find("a.applink");
            whenLinkClicked();

            expect(Backbone.history.navigate)
                .toHaveBeenCalledWith("somewhere/inapp", {
                    trigger: true
                });
        });

        it("sets up application links to set ClientRequest as from link click", function() {
            $link = $fixture.find("a.applink");
            whenLinkClicked();

            expect(ClientRequest.isFromLinkClick).toHaveBeenCalled();
        });

        describe("does NOT navigate Backbone history on", function() {

            beforeEach(function() {
                $link = $fixture.find("a.applink");
                expect($link).toExist();
            });

            it("click default prevented by jquery", function() {
                $link.click(function(e) {
                    e.preventDefault();
                });
                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

            it("click default prevented by addEventListener", function() {
                $link[0].addEventListener("click", function(e) {
                    e.preventDefault();
                });
                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

            it("click default prevented by onclick", function() {
                $link[0].onclick = function(e) {
                    e.preventDefault();
                };
                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

            it("Firefox bubbles right click", function() {
                whenFirefoxRightClick();
                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

            it("Firefox bubbles middle button click", function() {
                whenFirefoxMiddleButtonClick();
                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

            it("alt + click", function() {
                whenHoldingAltKey();
                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

            it("ctrl + click", function() {
                whenHoldingCtrlKey();
                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

            it("meta + click", function() {
                whenHoldingMetaKey();
                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

            it("shift + click", function() {
                whenHoldingShiftKey();
                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

        });

        describe("NOT Backbone navigating to NON application links", function() {

            it("link with target = _blank", function() {
                $link = $fixture.find("a.applink");
                $link.attr("target", "_blank");

                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

            it("hash links", function() {
                $link = $fixture.find("a[href^='#']");
                expect($link).toExist();

                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

            it("fully qualified link", function() {
                $link = $fixture.find("a[href^='http']");
                expect($link).toExist();

                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

            it("absolute path link", function() {
                $link = $fixture.find("a[href^='/']");
                expect($link).toExist();

                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

            it("mailto link", function() {
                $link = $fixture.find("a[href^='mailto']");
                expect($link).toExist();

                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

            it("javascript code link", function() {
                $link = $fixture.find("a[href^='javascript']");
                expect($link).toExist();

                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

        });

        describe("#replacePath", function() {

            it("replaces route with requested route", function() {
                SetupLinksAndPushState.replacePath("newRoute");

                expect(Backbone.history.navigate).toHaveBeenCalledWith("newRoute", {
                    replace: true
                });
            });

            it("does NOT replace route if invalid route is requested", function() {
                SetupLinksAndPushState.replacePath(1);
                SetupLinksAndPushState.replacePath();
                SetupLinksAndPushState.replacePath({});

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

        });

        describe("#changePath", function() {

            it("calls Backbone navigate with requested route", function() {
                SetupLinksAndPushState.changePath("newRoute");

                expect(Backbone.history.navigate).toHaveBeenCalledWith("newRoute");
            });

            it("does NOT update location when invalid route is requested", function() {
                SetupLinksAndPushState.changePath(1);
                SetupLinksAndPushState.changePath();
                SetupLinksAndPushState.changePath({});

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

        });

        itNavigatesToRoutes();
        itReloadsRoute();
    });

    describe("when starting WITHOUT pushState", function() {

        beforeEach(function() {
            SetupLinksAndPushState.start({
                root: "",
                browserSupportsPushState: false
            });

            document.addEventListener("click", preventRealClick);
        });

        it("starts Backbone history", function() {
            expect(Backbone.history.start).toHaveBeenCalled();
        });

        it("starts Backbone history with pushState disabled", function() {
            expect(Backbone.history.start.calls.mostRecent().args[0])
                .toHaveKeyValue("pushState", false);
        });

        it("starts Backbone history silently", function() {
            expect(Backbone.history.start.calls.mostRecent().args[0])
                .toHaveKeyValue("silent", true);
        });

        describe("NOT Backbone navigating to ANY links", function() {

            it("application links", function() {
                $link = $fixture.find("a.applink");
                expect($link).toExist();

                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

            it("hash links", function() {
                $link = $fixture.find("a[href^='#']");
                expect($link).toExist();

                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

            it("fully qualified link", function() {
                $link = $fixture.find("a[href^='http']");
                expect($link).toExist();

                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

            it("absolute path link", function() {
                $link = $fixture.find("a[href^='/']");
                expect($link).toExist();

                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

            it("mailto link", function() {
                $link = $fixture.find("a[href^='mailto']");
                expect($link).toExist();

                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

            it("javascript code link", function() {
                $link = $fixture.find("a[href^='javascript']");
                expect($link).toExist();

                whenLinkClicked();

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

        });

        describe("#replacePath", function() {

            it("does NOT trigger requested route", function() {
                SetupLinksAndPushState.replacePath("newRoute");

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

        });

        describe("#changePath", function() {

            it("does NOT update location with requested route", function() {
                SetupLinksAndPushState.changePath("newRoute");

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

        });

        itNavigatesToRoutes();
        itReloadsRoute();
    });

    describe("when setting the root", function() {

        beforeEach(function() {
            SetupLinksAndPushState.start({
                root: "some/root",
                browserSupportsPushState: true
            });
        });

        it("starts Backbone history", function() {
            expect(Backbone.history.start).toHaveBeenCalled();
        });

        it("starts Backbone history with pushState disabled", function() {
            expect(Backbone.history.start.calls.mostRecent().args[0])
                .toHaveKeyValue("root", "some/root");
        });
    });

    function itNavigatesToRoutes() {
        describe("#navigateTo", function() {

            it("triggers route for requested route", function() {
                SetupLinksAndPushState.navigateTo("newRoute");

                expect(Backbone.history.navigate).toHaveBeenCalledWith("newRoute", {
                    trigger: true
                });
            });

            it("does NOT navigate to route if invalid route is requested", function() {
                SetupLinksAndPushState.navigateTo(1);
                SetupLinksAndPushState.navigateTo();
                SetupLinksAndPushState.navigateTo({});

                expect(Backbone.history.navigate).not.toHaveBeenCalled();
            });

        });
    }

    function itReloadsRoute() {
        describe("#reloadRoute", function() {

            it("reruns the current route", function() {
                SetupLinksAndPushState.reloadRoute();

                expect(Backbone.history.loadUrl).toHaveBeenCalledWith();
            });

        });
    }

    function whenFirefoxRightClick() {
        clickEvent.button = 2;
    }

    function whenFirefoxMiddleButtonClick() {
        clickEvent.button = 1;
    }

    function whenHoldingAltKey() {
        clickEvent.altKey = true;
    }

    function whenHoldingCtrlKey() {
        clickEvent.ctrlKey = true;
    }

    function whenHoldingMetaKey() {
        clickEvent.metaKey = true;
    }

    function whenHoldingShiftKey() {
        clickEvent.shiftKey = true;
    }

    function whenLinkClicked() {
        $link[0].dispatchEvent(clickEvent);
    }

    function preventRealClick(e) {
        e.preventDefault();
        return false;
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
