"use strict";

var MockExpressRequest = {

    basic: function() {
        return {
            protocol: "http",
            path: "/requested/path",
            host: "example.com",
            hostname: "example.com",
            headers: {
                "host": "example.com:8080",
                "referer": "theReferrer.com",
                "user-agent": "A wonderful computer"
            },
            query: {
                some: "param",
                another: {
                    param: "value"
                }
            },
            originalUrl: "/requested/path?some=param&another%5Bparam%5D=value"
        };
    },

    withoutQueryParam: function() {
        return {
            protocol: "http",
            path: "/requested/path",
            host: "example.com",
            headers: {
                "host": "example.com:8080",
                "referer": "theReferrer.com",
                "user-agent": "A wonderful computer"
            },
            originalUrl: "/requested/path"
        };
    }

};

module.exports = MockExpressRequest;
