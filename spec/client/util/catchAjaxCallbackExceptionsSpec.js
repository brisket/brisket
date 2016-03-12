"use strict";

describe("catchAjaxCallbackExceptions", function() {
    var catchAjaxCallbackExceptions = require("lib/util/catchAjaxCallbackExceptions");

    var options;
    var bubbleError;
    var error;

    beforeEach(function() {
        bubbleError = jasmine.createSpy("bubbleError");
        error = new Error();
    });

    itBubblesErrorFromCallback("success");
    itBubblesErrorFromCallback("error");

    itDoesNotAddCallbackIfNotInOriginalOptions("success");
    itDoesNotAddCallbackIfNotInOriginalOptions("error");

    function itBubblesErrorFromCallback(which) {
        it("bubbles error when " + which + " callback throws an error", function() {
            options = {};
            options[which] = jasmine.createSpy(which).and.throwError(error);

            catchAjaxCallbackExceptions(null, null, options, bubbleError);

            options[which]();

            expect(bubbleError).toHaveBeenCalledWith(error);
        });
    }

    function itDoesNotAddCallbackIfNotInOriginalOptions(which) {
        it("does NOT add " + which + " callback to options if not already there", function() {
            options = {};

            catchAjaxCallbackExceptions(null, null, options, bubbleError);

        });
    }

});

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
