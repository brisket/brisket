"use strict";

var compiledHoganTemplateAdapter = require("lib/templating/compiledHoganTemplateAdapter");

describe("compiledHoganTemplateAdapter", function() {

    it("requires that you pass in compiled templates", function() {
        var creatingAnAdapterWithoutPassingCompiledTemplates = function() {
            compiledHoganTemplateAdapter();
        };

        expect(creatingAnAdapterWithoutPassingCompiledTemplates).toThrow();
    });

    it("requires that compiled templates that you pass in must be an object", function() {
        var creatingAnAdapterPassingCompiledTemplatesAsNonObject = function() {
            compiledHoganTemplateAdapter(function() {});
        };

        var creatingAnAdapterPassingCompiledTemplatesAsObject = function() {
            compiledHoganTemplateAdapter({});
        };

        expect(creatingAnAdapterPassingCompiledTemplatesAsNonObject).toThrow();
        expect(creatingAnAdapterPassingCompiledTemplatesAsObject).not.toThrow();
    });

    it("does not validate that all your compiled templates are valid", function() {
        var creatingAnAdapterWithInvalidTemplate = function() {
            compiledHoganTemplateAdapter({
                "template1": "not a Hogan compiled template"
            });
        };

        expect(creatingAnAdapterWithInvalidTemplate).not.toThrow();
    });

    describe("when you pass valid hogan compiled templates", function() {

        var validCompiledTemplates;
        var templateId;
        var template;
        var data;
        var partial;
        var CompiledHoganTemplateAdapter;

        beforeEach(function() {
            template = validHoganTemplate("template");
            partial = validHoganTemplate("partial");
            data = {
                some: "data"
            };

            validCompiledTemplates = {
                "template1": template,
                "partial1": partial
            };

            CompiledHoganTemplateAdapter = compiledHoganTemplateAdapter(validCompiledTemplates);
        });

        describe("when templateId exists in compiled templates", function() {

            beforeEach(function() {
                templateId = "template1";
            });

            it("returns a template adapter that finds a template if it exists", function() {
                expect(CompiledHoganTemplateAdapter.templateToHTML(templateId)).toBe("template");
            });

            it("renders template with passed data", function() {
                CompiledHoganTemplateAdapter.templateToHTML(templateId, data);

                expect(template.render.calls.mostRecent().args[0]).toBe(data);
            });

            it("renders template with resolved partials", function() {
                CompiledHoganTemplateAdapter.templateToHTML(templateId, data, {
                    "aPartialName": "partial1"
                });

                expect(template.render.calls.mostRecent().args[1]).toEqual({
                    "aPartialName": partial
                });
            });

        });

        describe("when templateId does NOT exist in compiled templates", function() {

            beforeEach(function() {
                templateId = "not in compiled templates";
            });

            it("throws an error", function() {
                var gettingHtmlForTemplateIdThatDoesNotExist = function() {
                    CompiledHoganTemplateAdapter.templateToHTML(templateId);
                };

                expect(gettingHtmlForTemplateIdThatDoesNotExist).toThrow();
            });
        });

    });

    function validHoganTemplate(html) {
        return {
            render: jasmine.createSpy().and.returnValue(html)
        };
    }

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
