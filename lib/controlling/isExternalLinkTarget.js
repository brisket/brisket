"use strict";

/**
 * Determines whether the target points to a different window, and thus outside of
 * the current instance of the application.
 * @param {String} target The value of the link's target attribute.
 * @returns {Boolean} true when the target is:
 *   - "_blank",
 *   - "_parent", and the parent window isn't the current window,
 *   - "_top", and the top window isn't the current window.
 *   - a named window or frame (any other value besides "_self").
 */
function isExternalLinkTarget(target) {
    return target === "_blank" ||
        (target === "_parent" && window.parent !== window.self) ||
        (target === "_top" && window.top !== window.self) ||
        (typeof target === "string" && target !== "_self");
}

module.exports = isExternalLinkTarget;

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
