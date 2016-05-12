"use strict";

var ClientRequest = require("../lib/client/ClientRequest");
var mockWindow = require("../spec/mock/mockWindow");

var clientRequest;
var windough = mockWindow();
var doesntWantCookies = {};
var wantsCookies = {
    "brisket:wantsCookies": true
};

module.exports = {
    name: "Creating and using a ClientRequest object",
    maxTime: 2,
    tests: {

        "when app doesn't want cookies": function() {
            clientRequest = ClientRequest.from(windough, 1, doesntWantCookies);
            clientRequest.cookies;
        },

        "when app wants cookies BUT cookies NOT accessed": function() {
            clientRequest = ClientRequest.from(windough, 1, wantsCookies);
            clientRequest.isFirstRequest;
        },

        "when app wants cookies AND cookies accessed": function() {
            clientRequest = ClientRequest.from(windough, 1, wantsCookies);
            clientRequest.cookies;
        }

    }
};
