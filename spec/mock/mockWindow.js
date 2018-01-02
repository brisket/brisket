"use strict";

function mockWindow() {
    return {
        document: {
            referrer: "theReferrer"
        },
        location: {
            protocol: "http:",
            host: "example.com:8080",
            hostname: "example.com",
            pathname: "/requested/path",
            search: "?some=param&another%5Bparam%5D=value",
            replace: jasmine.createSpy("mockWindow.location.replace")
        },
        navigator: {
            userAgent: "A wonderful computer"
        }
    };
}

module.exports = mockWindow;

// ----------------------------------------------------------------------------
// Copyright (C) 2018 Bloomberg Finance L.P.
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
