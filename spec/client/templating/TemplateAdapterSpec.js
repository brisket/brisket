"use strict";

var TemplateAdapter = require("lib/templating/TemplateAdapter");

describe("TemplateAdapter", function() {

    var ExampleTemplateAdapter;
    var NthTemplateAdapter;

    it("can be extended", function() {
        ExampleTemplateAdapter = TemplateAdapter.extend();

        expect(TemplateAdapter.isPrototypeOf(ExampleTemplateAdapter));
    });

    it("can be extended with custom properties", function() {
        ExampleTemplateAdapter = TemplateAdapter.extend({
            "some": "property"
        });

        expect(ExampleTemplateAdapter).toHaveKeyValue("some", "property");
    });

    it("requires that you implement templateToHTML", function() {

        var executingTemplateToHTMLWithoutImplementing = function() {
            ExampleTemplateAdapter = TemplateAdapter.extend();
            ExampleTemplateAdapter.templateToHTML("some template", {
                some: "data"
            }, {
                a: "partial"
            });
        };

        expect(executingTemplateToHTMLWithoutImplementing).toThrow();
    });

    it("'s subclasses can be extended", function() {
        ExampleTemplateAdapter = TemplateAdapter.extend();
        NthTemplateAdapter = ExampleTemplateAdapter.extend();

        expect(ExampleTemplateAdapter.isPrototypeOf(NthTemplateAdapter));
        expect(TemplateAdapter.isPrototypeOf(NthTemplateAdapter));
    });

});

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
