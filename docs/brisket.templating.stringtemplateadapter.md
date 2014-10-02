Brisket.Templating.StringTemplateAdapter
======================================

A simple implementation of [Brisket.Templating.TemplateAdapter](brisket.templating.templateadapter.md) that lets your Views specify a string template in-place.

## Usage
Brisket.Templating.StringTemplateAdapter is the default TemplateAdapter for Brisket.View so you can use it right away:

```js
var View = Brisket.View.extend({

    template: '<abbr class="laughing out loud">lol</abbr>'

});

var view = new View();
console.log(view.render().el.innerHTML); // '<abbr class="laughing out loud">lol</abbr>'
```

**Note:** The StringTemplateAdapter that ships with Brisket does not handle data i.e. the template will be rendered into the View's `el` exactly as it is specified regardless of any data that you attempt to pass to it. For example:

```js
var View = Brisket.View.extend({

    template: '<abbr class="laughing out loud">lol {{some}}</abbr>'

    logic: function() {
        return {
            some: 'data'
        };
    }

});

var view = new View();
console.log(view.render().el.innerHTML); // '<abbr class="laughing out loud">lol {{some}}</abbr>'
```

As you can see, even though we setup a logic function (read [here](brisket.view.md#exposing-data-to-a-template) for more on passing data to a template), the data does NOT get used in the template.

If you need a StringTemplateAdapter that can use data too, you will have to [implement your own](brisket.templating.templateadapter.md#implementing-your-own-templateadapter).
