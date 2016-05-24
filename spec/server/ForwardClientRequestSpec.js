"use strict";

describe("ForwardClientRequest", function() {
    var stream = require("stream");
    var ForwardClientRequest = require("../../lib/server/ForwardClientRequest");
    var Testable = require("../../lib/util/Testable");
    var Errors = require("../../lib/errors/Errors");
    var noop = require("../../lib/util/noop");

    var req;
    var res;
    var requestStream;
    var incomingMessage;
    var forwardingMiddleware;
    var apiConfig;

    beforeEach(function() {
        req = mockStream();
        req.url = "/path/to/data";

        spyOn(req, "pipe").and.callThrough();

        res = mockStream();

        requestStream = mockStream();
        spyOn(requestStream, "pipe").and.callThrough();

        spyOn(Testable, "request").and.returnValue(requestStream);
        spyOn(Errors, "notify");
    });

    it("forwards api requests", function() {
        givenApiConfigHasProxy();
        givenApiResponseWillSucceed();
        whenMiddlewareForwardsRequest();

        thenRequestIsMadeToApiWithProxy();
        thenRequestIsPipedToResponse();
        expect(Errors.notify).not.toHaveBeenCalled();
    });

    it("forwards api requests when config does NOT have proxy", function() {
        givenApiConfigDoesNOTHaveProxy();
        givenApiResponseWillSucceed();
        whenMiddlewareForwardsRequest();

        thenRequestIsMadeToApiWITHOUTProxy();
        thenRequestIsPipedToResponse();
        expect(Errors.notify).not.toHaveBeenCalled();
    });

    it("notifies app of an error when response from remote api is failure", function() {
        givenApiConfigHasProxy();
        givenApiResponseWillFail();
        whenMiddlewareForwardsRequest();

        thenRequestIsMadeToApiWithProxy();
        thenRequestIsPipedToResponse();
        expect(Errors.notify).toHaveBeenCalledWith(incomingMessage, req);
    });

    function givenApiConfigHasProxy() {
        apiConfig = {
            host: "http://www.example.com",
            proxy: "http://proxy.example.com"
        };
    }

    function givenApiConfigDoesNOTHaveProxy() {
        apiConfig = {
            host: "http://www.example.com"
        };
    }

    function givenApiResponseWillSucceed() {
        incomingMessage = {
            statusCode: 200
        };
    }

    function givenApiResponseWillFail() {
        incomingMessage = {
            statusCode: 400
        };
    }

    function whenMiddlewareForwardsRequest() {
        forwardingMiddleware = ForwardClientRequest.toApi(apiConfig);
        forwardingMiddleware(req, res);

        requestStream.emit("response", incomingMessage);
    }

    function thenRequestIsMadeToApiWithProxy() {
        expect(Testable.request).toHaveBeenCalledWith(jasmine.objectContaining({
            url: "http://www.example.com/path/to/data",
            proxy: "http://proxy.example.com"
        }));
    }

    function thenRequestIsMadeToApiWITHOUTProxy() {
        expect(Testable.request).toHaveBeenCalledWith(jasmine.objectContaining({
            url: "http://www.example.com/path/to/data",
            proxy: null
        }));
    }

    function thenRequestIsPipedToResponse() {
        expect(req.pipe).toHaveBeenCalledWith(requestStream);
        expect(requestStream.pipe).toHaveBeenCalledWith(res);
    }

    function mockStream() {
        var mock = new stream.Readable();
        mock._read = noop;

        return mock;
    }

});
