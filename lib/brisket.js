"use strict";

var Brisket = {

    RouterBrewery: require("./controlling/RouterBrewery"),

    Routers: require("./controlling/Routers"),

    Controller: require("./controlling/Controller"),

    Model: require("./modeling/Model"),

    Collection: require("./modeling/Collection"),

    View: require("./viewing/View"),

    ErrorViewMapping: require("./errors/ErrorViewMapping"),

    Layout: require("./viewing/Layout"),

    // Layout.Metatags is also provided,

    Templating: {
        TemplateAdapter: require("./templating/TemplateAdapter"),
        StringTemplateAdapter: require("./templating/StringTemplateAdapter"),
        compiledHoganTemplateAdapter: require("./templating/compiledHoganTemplateAdapter")
    },

    ServerApp: require("./server/ServerApp"),

    ClientApp: require("./client/ClientApp"),

    Testing: require("./testing/Testing"),

    createServer: require("./server/Server").create,

    Backbone: require("./application/Backbone"),

    $: require("./application/jquery"),

    onError: require("./errors/Errors").onError

};

module.exports = Brisket;

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
