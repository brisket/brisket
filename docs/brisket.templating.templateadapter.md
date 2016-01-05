Brisket.Templating.TemplateAdapter
================================
Brisket.Templating.TemplateAdapter is the base class for all TemplateAdapters that Brisket uses to render templates. Brisket will only accept TemplateAdapters that extend from Brisket.Templating.TemplateAdapter.


## Implementing Your Own TemplateAdapter
While Brisket ships with only one TemplateAdapter - ([Brisket.Templating.StringTemplateAdapter](brisket.templating.stringtemplateadapter.md) - you might want to build your own template adapter.

To build your own TemplateAdapter, build an object that extends from Brisket.Templating.TemplateAdapter and implement the method `templateToHTML`. `templateToHTML` will be passed three parameters - `template`, `data`, and `partials` and is expected to return a string.

`template` is a View's template field. `data` is the data that the View sends to its template (read [here](brisket.view.md#exposing-data-to-a-template) for more details on what is passed). `partials` is the partials field of a View - this is where you could specify the partials that the View's template will use.

You can use all or none of the parameters that are passed to templateToHTML, but you MUST implement templateToHTML.

Below is a TemplateAdapter that always returns "hello world";

```js
var HelloWorldTemplateAdapter = Brisket.Templating.TemplateAdapter.extend({

    templateToHTML: function(template, data, partials) {
        return 'hello world';
    }

});
```

Here is the implementation of the StringTemplateAdapter that ships with Brisket:

```js
var StringTemplateAdapter = Brisket.Templating.TemplateAdapter.extend({

    templateToHTML: function(template, data, partials) {
        if (typeof template !== "function") {
            return template;
        }

        return template(data);
    }

});
```

The StringTemplateAdapter uses the `template` and `data` but ignores`partials`.

Below is an example implementation of a Mustache TemplateAdapter. It uses all three parameters:

```js
var MustacheTemplateAdapter = TemplateAdapter.extend({

    templateToHTML: function(template, data, partials) {
        return Mustache.render(template, data, partials);
    }

});
```
