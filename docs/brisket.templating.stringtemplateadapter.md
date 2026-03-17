Brisket.Templating.StringTemplateAdapter
======================================

A simple implementation of [Brisket.Templating.TemplateAdapter](brisket.templating.templateadapter.md) that lets your Views specify a string template in-place.

## Usage
Brisket.Templating.StringTemplateAdapter is the default TemplateAdapter for Brisket.View so you can use it right away:

```js
const View = Brisket.View.extend({

  template: `<abbr class="laughing out loud">lol</abbr>`,

});

const view = new View();
console.log(view.render().el.innerHTML); // '<abbr class="laughing out loud">lol</abbr>'
```

The StringTemplateAdapter that ships with Brisket can handle data too. For example:

```js
const View = Brisket.View.extend({

  template: ({ some }) => {
    return `<abbr class="laughing out loud">lol ${some}</abbr>`,
  }

  logic() {
    return {
      some: 'data',
    };
  },

});

const view = new View();
console.log(view.render().el.innerHTML); // '<abbr class="laughing out loud">lol data</abbr>'
```

As you can see, data from the logic function (read [here](brisket.view.md#exposing-data-to-a-template) is passed to the template function.
