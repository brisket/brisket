(function(global, undefined) {
    "use strict";

    var _ = require("underscore");

    var additionalMatchers = {

        // enhancing toBe the same way jquery jasmine did
        toBe: function(selector) {
            var builtInToBe = jasmine.Matchers.prototype.toBe;

            if (this.actual && (this.actual.jquery || jasmine.isDomNode(this.actual))) {
                return this.actual.is(selector);
            }

            return builtInToBe.apply(this, arguments);
        },

        toBeEqualTo: function(expected) {
            return _.isEqual(expected, this.actual);
        },

        toContainText: function(text) {
            var trimmedText = this.actual.text().trim();

            if (text && typeof text.test === "function") {
                return text.test(trimmedText);
            }

            return trimmedText.indexOf(text) != -1;
        },

        toExist: function() {
            return this.actual.length > 0;
        },

        toBeAttachedToDom: function() {
            var $el = this.actual;
            return $el.closest("body").length > 0;
        },

        toBeHTMLEqual: function(expected) {
            return stripWhiteSpaceBecauseItsNotRelevantToTest(this.actual) ===
                stripWhiteSpaceBecauseItsNotRelevantToTest(expected);
        },

        toHaveKey: function(key) {
            if (key === null || key === undefined) {
                throw new Error(
                    "You cannot ask if something has a key " +
                    "without the key to look for"
                );
            }

            return key in this.actual;
        },

        toHaveKeyValue: function(key, value) {
            if (key === null || key === undefined) {
                throw new Error(
                    "You cannot ask if something has a key " +
                    "without the key to look for"
                );
            }

            return key in this.actual && this.actual[key] === value;
        }

    };

    // TODO: make this an additionalMatcher - toBeHTMLEqual
    //  The rules would also need to account for intentional spaces
    //  since not all HTML is minified
    function stripWhiteSpaceBecauseItsNotRelevantToTest(transformed) {
        var stripped = transformed;
        stripped = stripped.replace(/>[\s]+([\S]+)/g, ">$1");
        stripped = stripped.replace(/([\S]+)[\s]+</g, "$1<");

        return stripped;
    }

    beforeEach(function() {
        this.addMatchers(additionalMatchers);
    });

    global.additionalMatchers = additionalMatchers;
})(this);

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
