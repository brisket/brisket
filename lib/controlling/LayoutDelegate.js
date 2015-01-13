"use strict";

var _ = require("underscore");

var LayoutDelegate = function() {};

LayoutDelegate.prototype = {

    inRecordMode: true,

    stopRecording: function() {
        this.inRecordMode = false;
    }

};

LayoutDelegate.from = function(layout) {
    var recordedInstructions = [];

    var layoutDelegate = new LayoutDelegate();

    for (var methodName in layout) {
        if (typeof layout[methodName] !== "function") {
            continue;
        }

        layoutDelegate[methodName] = makeDelegate(
            layoutDelegate,
            recordedInstructions,
            methodName,
            layout
        );
    }

    layoutDelegate.replayInstructions = function() {
        _.each(recordedInstructions, function(recordedInstruction) {
            var methodName = recordedInstruction.methodName;
            var methodArguments = recordedInstruction.methodArguments;

            callLayout(layout, methodName, methodArguments);
        });
    };

    return layoutDelegate;
};

function makeDelegate(layoutDelegate, recordedInstructions, methodName, layout) {
    return function() {
        if (layoutDelegate.inRecordMode) {
            record(recordedInstructions, methodName, arguments);

            return;
        }

        return callLayout(layout, methodName, arguments);
    };
}

function record(recordedInstructions, methodName, methodArguments) {
    recordedInstructions.push({
        methodName: methodName,
        methodArguments: methodArguments
    });
}

function callLayout(layout, methodName, methodArguments) {
    return layout[methodName].apply(layout, methodArguments);
}

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
