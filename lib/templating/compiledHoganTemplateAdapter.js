"use strict";

var TemplateAdapter = require("./TemplateAdapter");

var CompiledHoganTemplateAdapter = TemplateAdapter.extend({

    templateToHTML: function(templateId, data, partials) {
        var template = this.compiledTemplates[templateId];

        if (!template) {
            throw new Error("Could not find template: " + templateId);
        }

        var resolvedPartials = resolvePartials(partials, this.compiledTemplates);

        return template.render(data, resolvedPartials);
    }

});

function resolvePartials(partials, compiledTemplates) {
    var resolvedPartials = {};

    for (var partialName in partials) {
        if (partials.hasOwnProperty(partialName)) {
            var partialPath = partials[partialName];
            resolvedPartials[partialName] = compiledTemplates[partialPath];
        }
    }

    return resolvedPartials;
}

var compiledHoganTemplateAdapter = function(compiledTemplates) {
    if (typeof compiledTemplates != "object") {
        throw new Error(
            "You must pass compiled templates to create a " +
            "CompiledHoganTemplateAdapter."
        );
    }

    return CompiledHoganTemplateAdapter.extend({
        compiledTemplates: compiledTemplates
    });
};

module.exports = compiledHoganTemplateAdapter;

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
