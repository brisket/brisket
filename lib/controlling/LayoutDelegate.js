"use strict";

function makeLayoutDelegate(base) {
    base.layout = null;

    base.inRecordMode = true;

    base.stopRecording = function(layout) {
        this.inRecordMode = false;
        this.layout = layout;
    };

    return base;
}

var LayoutDelegate = {};

LayoutDelegate.from = function(Layout, base) {
    var recordedInstructions = [];

    var layoutDelegate = makeLayoutDelegate(base);

    for (var methodName in Layout.prototype) {
        if (typeof Layout.prototype[methodName] !== "function") {
            continue;
        }

        layoutDelegate[methodName] = makeDelegate(
            layoutDelegate,
            recordedInstructions,
            methodName
        );
    }

    layoutDelegate.replayInstructions = function(layout) {
        recordedInstructions.forEach(function(recordedInstruction) {
            var methodName = recordedInstruction.methodName;
            var methodArguments = recordedInstruction.methodArguments;

            callLayout(layout, methodName, methodArguments);
        });
    };

    return layoutDelegate;
};

function makeDelegate(layoutDelegate, recordedInstructions, methodName) {
    return function() {
        if (layoutDelegate.inRecordMode) {
            record(recordedInstructions, methodName, arguments);

            return;
        }

        if (!layoutDelegate.layout) {
            return;
        }

        return callLayout(layoutDelegate.layout, methodName, arguments);
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
