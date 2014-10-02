(function(global, undefined) {
    "use strict";

    var FOR_PREFIX = "for ";

    function removeForInMessage(message) {
        if (typeof message != "string") {
            return message;
        }

        if (message.indexOf(FOR_PREFIX) === 0) {
            return message.substr(FOR_PREFIX.length);
        }

        return message;
    }

    var Wait = function(message) {
        this.message = removeForInMessage(message);
    };

    Wait.prototype = {

        message: null,
        howlong: 1000,
        promise: null,

        forMax: function(howlong) {
            this.howlong = howlong;

            return this;
        },

        until: function(promise) {
            this.promise = promise;

            return this;
        },

        then: function(doSomething) {

            var promiseReturned = false;

            waitsFor(function() {
                return promiseReturned === true;
            }, this.message, this.howlong);

            var handlePromiseReturn = function() {
                var args = arguments;
                promiseReturned = true;

                runs(function() {
                    doSomething.apply(this, args);
                });
            };

            this.promise.then(
                handlePromiseReturn,
                handlePromiseReturn
            );

        }

    };

    var wait = function(message) {
        return new Wait(message);
    };

    global.wait = wait;

})(this);

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
