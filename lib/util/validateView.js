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
        "var Router = Brisket.RouterBrewery.create({" +
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
