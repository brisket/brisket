"use strict";

var Backbone = require("../application/Backbone");

function validateView(view) {
    if (view instanceof Backbone.View) {
        return;
    }

    throw new Error(
        "Your route handler returns '" + view + "' or a promise with " +
        "the value '" + view + "'. Route handlers must return an instance " +
        "of a Backbone.View OR a promise with a value that is a Backbone.View. " +
        "\n\n" +
        "See an example below:" +
        "\n\n" +
        "var View = Brisket.View.extend();" +
        "\n\n" +
        "var Router = Brisket.Router.extend({" +
        "\n\n" +
        "\troutes: {\n" +
        "\t\t'example': 'example'\n" +
        "\t}," +
        "\n\n" +
        "\texample: function() {\n" +
        "\t\treturn new View();\n" +
        "\t}" +
        "\n\n" +
        "});"
    );
}

module.exports = validateView;

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
