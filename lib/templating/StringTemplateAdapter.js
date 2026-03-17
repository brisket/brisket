import TemplateAdapter from './TemplateAdapter.js';

const StringTemplateAdapter = TemplateAdapter.extend({

  templateToHTML(template, data) {
    if (typeof template !== 'function') {
      return template;
    }

    return template(data);
  }

});

export default StringTemplateAdapter;

