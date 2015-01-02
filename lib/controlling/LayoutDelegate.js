"use strict";

var _ = require("underscore");

function makeRecordingHandler(recordedInstructions, methodName) {
    return function() {
        recordedInstructions.push({
            methodName: methodName,
            methodArguments: arguments
        });
    };
}

var LayoutDelegate = function() {};

LayoutDelegate.from = function(layout) {
    var recordedInstructions = [];

    var layoutDelegate = new LayoutDelegate();

    for (var methodName in layout) {
        if (typeof layout[methodName] !== "function") {
            continue;
        }

        layoutDelegate[methodName] = makeRecordingHandler(recordedInstructions, methodName);
    }

    layoutDelegate.replayInstructions = function() {
        _.each(recordedInstructions, function(recordedInstruction) {
            var methodName = recordedInstruction.methodName;
            var methodArguments = recordedInstruction.methodArguments;

            layout[methodName].apply(layout, methodArguments);
        });
    };

    return layoutDelegate;
};

module.exports = LayoutDelegate;

// ----------------------------------------------------------------------------
// Copyright (C) 2015 Bloomberg Finance L.P.
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
