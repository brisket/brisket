"use strict";

var createDomain = require("domain").create;

var DATA_KEY = "brisket:domainLocalStorage";

var DomainLocalStorage = {

    middleware: function(request, response, next) {
        var domain = createDomain();
        domain.id = domainUid(request);
        domain.add(request);
        domain.add(response);
        domain[DATA_KEY] = {};

        domain.run(function() {
            next();
        });

        domain.on("error", function(e) {
            next(e);
        });
    },

    get: function(attribute) {
        if (!currentDomain()) {
            return null;
        }

        return currentDomain()[DATA_KEY][attribute];
    },

    getAll: function() {
        if (!currentDomain()) {
            return null;
        }

        return currentDomain()[DATA_KEY];
    },

    set: function(attribute, value) {
        if (!currentDomain()) {
            return;
        }

        currentDomain()[DATA_KEY][attribute] = value;
    }

};

function domainUid(request) {
    return request._id;
}

function currentDomain() {
    var domain = process.domain;

    if (!domain || !domain[DATA_KEY]) {
        return;
    }

    return domain;
}

module.exports = DomainLocalStorage;

// ----------------------------------------------------------------------------
// Copyright (C) 2014 Bloomberg L.P.
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
