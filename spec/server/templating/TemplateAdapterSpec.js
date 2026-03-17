import TemplateAdapter from '../../../lib/templating/TemplateAdapter.js';

describe('TemplateAdapter', function() {

  let ExampleTemplateAdapter;
  let NthTemplateAdapter;

  it('can be extended', function() {
    ExampleTemplateAdapter = TemplateAdapter.extend();

    expect(Object.prototype.isPrototypeOf.call(TemplateAdapter, ExampleTemplateAdapter)).toBe(true);
  });

  it('can be extended with custom properties', function() {
    ExampleTemplateAdapter = TemplateAdapter.extend({
      'some': 'property'
    });

    expect(ExampleTemplateAdapter).toHaveKeyValue('some', 'property');
  });

  it('requires that you implement templateToHTML', function() {

    const executingTemplateToHTMLWithoutImplementing = function() {
      ExampleTemplateAdapter = TemplateAdapter.extend();
      ExampleTemplateAdapter.templateToHTML('some template', {
        some: 'data'
      }, {
        a: 'partial'
      });
    };

    expect(executingTemplateToHTMLWithoutImplementing).toThrow();
  });

  it('\'s subclasses can be extended', function() {
    ExampleTemplateAdapter = TemplateAdapter.extend();
    NthTemplateAdapter = ExampleTemplateAdapter.extend();

    expect(Object.prototype.isPrototypeOf.call(ExampleTemplateAdapter, NthTemplateAdapter)).toBe(true);
    expect(Object.prototype.isPrototypeOf.call(TemplateAdapter, NthTemplateAdapter)).toBe(true);
  });

});

