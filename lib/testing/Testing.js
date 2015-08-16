"use strict";

import Configure from "../application/Configure";
import Layout from "../viewing/Layout";
import View from "../viewing/View";
import Backbone from "../application/Backbone";
import Events from "../events/Events";
import noop from "../util/noop";
import _ from "lodash";

var originalEvents = _.clone(Events);

var Testing = {

    setup: function() {
        Configure.backbone();
        Layout.prototype.reattach = noop;
    },

    enableEvents: function() {
        View.prototype.delegateEvents = Backbone.View.prototype.delegateEvents;
        View.prototype.undelegateEvents = Backbone.View.prototype.undelegateEvents;

        _.extend(View.prototype, Backbone.Events);
        _.extend(Events, Backbone.Events);
    },

    disableEvents: function() {
        View.prototype.delegateEvents = function() {
            return this;
        };

        View.prototype.undelegateEvents = function() {
            return this;
        };

        _.extend(View.prototype, originalEvents);
        _.extend(Events, originalEvents);
    }

};

export default Testing;

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
