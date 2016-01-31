(function(global, undefined) {
    "use strict";

    var additionalMatchers = {

        $toBe: function() {
            return {
                compare: function($actual, selector) {
                    if ($actual && ($actual.jquery || jasmine.isDomNode($actual))) {
                        return passIf($actual.is(selector));
                    }

                    return fail();
                }
            };
        },

        toContainText: function() {
            return {
                comapre: function(actual, text) {
                    var trimmedText = actual.text().trim();

                    if (text && typeof text.test === "function") {
                        return passIf(text.test(trimmedText));
                    }

                    return passIf(trimmedText.indexOf(text) != -1);
                }
            };
        },

        toExist: function() {
            return {
                compare: function(actual) {
                    return passIf(actual.length > 0);
                }
            };
        },

        toBeAttachedToDom: function() {
            return {
                compare: function(actual) {
                    var $el = actual;
                    return passIf($el.closest("body").length > 0);
                }
            };
        },

        toBeHTMLEqual: function() {
            return {
                compare: function(actual, expected) {
                    return passIf(stripWhiteSpaceBecauseItsNotRelevantToTest(actual) ===
                        stripWhiteSpaceBecauseItsNotRelevantToTest(expected));
                }
            };
        },

        toHaveKey: function() {
            return {
                compare: function(actual, key) {
                    if (key === null || key === undefined) {
                        throw new Error(
                            "You cannot ask if something has a key " +
                            "without the key to look for"
                        );
                    }

                    return passIf(key in actual);
                }
            };
        },

        toHaveKeyValue: function() {
            return {
                compare: function(actual, key, value) {
                    if (key === null || key === undefined) {
                        throw new Error(
                            "You cannot ask if something has a key " +
                            "without the key to look for"
                        );
                    }

                    return passIf(key in actual && actual[key] === value);
                }
            };
        }

    };

    function stripWhiteSpaceBecauseItsNotRelevantToTest(transformed) {
        var stripped = transformed;
        stripped = stripped.replace(/>[\s]+([\S]+)/g, ">$1");
        stripped = stripped.replace(/([\S]+)[\s]+</g, "$1<");

        return stripped.trim();
    }

    function fail() {
        return {
            pass: false
        };
    }

    function passIf(value) {
        return {
            pass: value
        };
    }

    beforeEach(function() {
        if (typeof this.addMatchers === "function") {
            this.addMatchers(additionalMatchers);
            return;
        }

        if (typeof jasmine.addMatchers === "function") {
            jasmine.addMatchers(additionalMatchers);
            return;
        }
    });

    global.additionalMatchers = additionalMatchers;
})(this);

// ----------------------------------------------------------------------------
// Copyright (C) 2016 Bloomberg Finance L.P.
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
