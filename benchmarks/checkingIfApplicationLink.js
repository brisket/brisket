var isApplicationLink = require("../lib/controlling/isApplicationLink");

var result;

module.exports = {
    name: "Checking if a link is application link",
    maxTime: 2,
    tests: {

        "hash link": function() {
            result = isApplicationLink("#top");
        },

        "fully qualified link": function() {
            result = isApplicationLink("http://www.somewhere.com");
        },

        "absolute link": function() {
            result = isApplicationLink("/absolute/path");
        },

        "mailto link": function() {
            result = isApplicationLink("mailto:someone@example.com");
        },

        "javascript code link": function() {
            result = isApplicationLink("javascript:{}");
        },

        "application link": function() {
            result = isApplicationLink("application/link");
        }

    }
};
