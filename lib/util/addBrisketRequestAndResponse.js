"use strict";

function addBrisketRequestAndResponse(routeArguments, brisketRequest, brisketResponse) {
    // The last parameter in routeArguments is always null because
    //  of Backbone request parsing. So here we just replace that
    //  last parameter with the request. Developers don't usually
    //  notice that the last parameter passed to their route handler
    //  is null. WWARNER 08/21/2014
    var paramsAndRequest = routeArguments;
    paramsAndRequest[routeArguments.length - 1] = brisketRequest;
    paramsAndRequest.push(brisketResponse);

    return paramsAndRequest;
}

module.exports = addBrisketRequestAndResponse;

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
