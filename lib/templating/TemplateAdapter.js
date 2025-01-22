const TemplateAdapter = {

  extend(props) {
    const newTemplateAdapter = Object.create(this);

    return Object.assign(newTemplateAdapter, props);
  },

  templateToHTML( /* template, data, partials */ ) {
    throw new Error(
      'You must implement templateToHTML in your template adapter ' +
            'so that Brisket can render a template. templateToHTML will ' +
            'be passed this.template, this.templateData(), and this.partials ' +
            'from an instance of a View'
    );
  }

};

export default TemplateAdapter;

