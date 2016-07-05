"use strict";

describe("Server side rendering content in layout", function() {
    var ServerRenderingWorkflow = require("../../lib/server/ServerRenderingWorkflow");
    var View = require("../../lib/viewing/View");
    var Layout = require("../../lib/viewing/Layout");
    var MockExpressRequest = require("../mock/MockExpressRequest");
    var MockRouter = require("../mock/MockRouter");
    var $ = require("../../lib/application/jquery");

    var originalHandler;
    var mockRouter;

    beforeEach(function() {
        originalHandler = function() {
            return contentView();
        };

    });

    it("renders 'content' view when it is placed in Layout template", function(done) {
        mockRouter = MockRouter.create({

            layout: Layout.extend({

                template: function(data) {
                    return "<!DOCTYPE html><html><head></head><body>" +
                        "<div class='before-content'></div>" +
                        data.views["content"] +
                        "</body></html>";
                }

            })

        });

        whenServerRenders()
            .then(expectRenderedToHave(".before-content + #content-view"))
            .catch(failOnError)
            .finally(done);
    });

    it("renders 'content' view when it is placed in Layout template", function(done) {
        mockRouter = MockRouter.create({

            layout: Layout.extend({

                template: function(data) {
                    return "<!DOCTYPE html><html><head></head><body>" +
                        "<div class='before-content'></div>" +
                        data.views["content"] +
                        "</body></html>";
                }

            })

        });

        whenServerRenders()
            .then(expectRenderedToHave(".before-content + #content-view"))
            .catch(failOnError)
            .finally(done);
    });

    it("renders 'content' view when it content selector specified on Layout", function(done) {
        mockRouter = MockRouter.create({

            layout: Layout.extend({

                content: "#content",

                template: function() {
                    return "<!DOCTYPE html><html><head></head><body>" +
                        "<div class='before-content'></div>" +
                        "<div id='content'></div>" +
                        "</body></html>";
                }

            })

        });

        whenServerRenders()
            .then(expectRenderedToHave(".before-content + #content #content-view"))
            .catch(failOnError)
            .finally(done);
    });

    it("renders 'content' view where placed in template even when content selector present", function(done) {
        mockRouter = MockRouter.create({

            content: "#content",

            layout: Layout.extend({

                template: function(data) {
                    return "<!DOCTYPE html><html><head></head><body>" +
                        "<div class='before-content'></div>" +
                        data.views["content"] +
                        "</bss                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              ody></html>";
                }

            })

        });

        whenServerRenders()
            .then(expectRenderedToHave(".before-content + #content-view"))
            .catch(failOnError)
            .finally(done);
    });

    it("does NOT render 'content' view it is NEITHER placed in template NOR specified with content selector", function(done) {
        mockRouter = MockRouter.create({

            content: "#content",

            layout: Layout.extend({

                template: function() {
                    return "<!DOCTYPE html><html><head></head><body>" +
                        "<div class='before-content'></div>" +
                        "</body></html>";
                }

            })

        });

        whenServerRenders()
            .then(expectRenderedDoesntHave("#content-view"))
            .catch(failOnError)
            .finally(done);
    });

    function whenServerRenders() {
        return ServerRenderingWorkflow.execute(
            mockRouter,
            originalHandler, [null],
            MockExpressRequest.basic(), {}
        );
    }

    function findIn(rendered, selector) {
        var $tmp = $("<div />");
        $tmp.html(rendered.html);

        return $tmp.find(selector);
    }

    function expectRenderedDoesntHave(selector) {
        return function(rendered) {
            expect(findIn(rendered, selector)).not.toExist();
        };
    }

    function expectRenderedToHave(selector) {
        return function(rendered) {
            expect(findIn(rendered, selector)).toExist();
        };
    }

    function failOnError(reason) {
        return expect(reason).toBeUndefined();
    }

    function contentView() {
        var view = new View();

        view.el.id = "content-view";

        return view;
    }

});
