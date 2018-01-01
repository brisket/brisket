"use strict";

describe("public interface to Brisket on client", function() {
    var Brisket = require("../../lib/brisket");
    var SetupLinksAndPushState = require("../../lib/client/SetupLinksAndPushState");

    it("exposes SetupLinksAndPushState navigateTo", function() {
        expect(Brisket.navigateTo).toBe(SetupLinksAndPushState.navigateTo);
    });

    it("exposes SetupLinksAndPushState reloadRoute", function() {
        expect(Brisket.reloadRoute).toBe(SetupLinksAndPushState.reloadRoute);
    });

    it("exposes SetupLinksAndPushState replacePath", function() {
        expect(Brisket.replacePath).toBe(SetupLinksAndPushState.replacePath);
    });

    it("exposes SetupLinksAndPushState updateLocation", function() {
        expect(Brisket.updateLocation).toBe(SetupLinksAndPushState.updateLocation);
    });

});

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
