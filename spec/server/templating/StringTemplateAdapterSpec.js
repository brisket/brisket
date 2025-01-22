import Backbone from 'backbone';
import StringTemplateAdapter from '../../../lib/templating/StringTemplateAdapter.js';
import View from '../../../lib/viewing/View.js';

const Model = Backbone.Model;

describe('StringTemplateAdapter', function() {

  let view;
  let ExampleView;
  let model;

  it('renders template string directly', function() {
    const SOME_LOCAL_CONSTANT = 'slc';

    ExampleView = View.extend({

      templateAdapter: StringTemplateAdapter,

      template: `<span class='test'>${SOME_LOCAL_CONSTANT}</span>`

    });

    view = new ExampleView();

    view.render();

    expect(view.el.innerHTML).toBe('<span class="test">slc</span>');
  });

  it('renders template string function as a string', function() {
    ExampleView = View.extend({

      templateAdapter: StringTemplateAdapter,

      template() {
        return '<span class=\'test\'>I should be rendered</span>';
      }

    });

    view = new ExampleView();

    view.render();

    expect(view.el.innerHTML)
      .toBe('<span class="test">I should be rendered</span>');
  });

  it('passes view data to template string function as a string', function() {
    ExampleView = View.extend({

      templateAdapter: StringTemplateAdapter,

      logic() {
        return {
          'logicKey': 'logic-value'
        };
      },

      template(data) {
        const modelKey = data.modelKey;
        const logicKey = data.logicKey;

        return `<span class='test'>model: ${modelKey
        }, logic: ${logicKey}</span>`;
      }

    });

    model = new Model();
    model.set('modelKey', 'model-value');

    view = new ExampleView({
      model
    });

    view.render();

    expect(view.el.innerHTML)
      .toBe('<span class="test">model: model-value, logic: logic-value</span>');
  });

});

