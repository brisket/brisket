"use strict";

var SetupLinksAndPushState = require("./client/SetupLinksAndPushState");
var onlyRunsOnClient = require("./environment/Environment").onlyRunsOnClient;

var Brisket = {

    createServer: require("./server/Server").create,

    App: require("./application/App"),

    Router: require("./controlling/Router"),

    RouterBrewery: require("./controlling/RouterBrewery"),

    Controller: require("./controlling/Controller"),

    Model: require("./modeling/Model"),

    Collection: require("./modeling/Collection"),

    View: require("./viewing/View"),

    Layout: require("./viewing/Layout"),

    // Layout.Metatags is also provided,

    Events: require("./events/Events"),

    ErrorViewMapping: require("./errors/ErrorViewMapping"),

    Templating: {
        TemplateAdapter: require("./templating/TemplateAdapter"),
        StringTemplateAdapter: require("./templating/StringTemplateAdapter")
    },

    Testing: require("./testing/Testing"),

    Backbone: require("./application/Backbone"),

    $: require("./application/jquery"),

    version: require("../version.json").version,

    onError: require("./errors/Errors").onError,

    navigateTo: onlyRunsOnClient(SetupLinksAndPushState.navigateTo),

    reloadRoute: onlyRunsOnClient(SetupLinksAndPushState.reloadRoute),

    replacePath: onlyRunsOnClient(SetupLinksAndPushState.replacePath),

    changePath: onlyRunsOnClient(SetupLinksAndPushState.changePath)

};

module.exports = Brisket;

// ----------------------------------------------------------------------------
// Copyright (C) 2016 Bloomberg Finance L.P.
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
