"use strict";

describe("pathJoin", function() {
    var pathJoin = require("../../../lib/util/pathJoin");

    it("joins domain and path", function() {
        expect(pathJoin("http://www.example.com", "path")).toBe("http://www.example.com/path");
        expect(pathJoin("http://www.example.com/", "path")).toBe("http://www.example.com/path");
        expect(pathJoin("http://www.example.com/", "/path")).toBe("http://www.example.com/path");
    });

    it("joins appRoot and path", function() {
        expect(pathJoin("/appRoot", "path")).toBe("/appRoot/path");
        expect(pathJoin("/appRoot/", "path")).toBe("/appRoot/path");
        expect(pathJoin("/appRoot/", "/path")).toBe("/appRoot/path");
    });

    it("joins null and path", function() {
        expect(pathJoin(null, "path")).toBe("/path");
        expect(pathJoin(null, "/path")).toBe("/path");
    });

    it("joins undefined and path", function() {
        expect(pathJoin(undefined, "path")).toBe("/path");
        expect(pathJoin(undefined, "/path")).toBe("/path");
    });

});
