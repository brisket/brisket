Brisket.Layout
============

A specialized Brisket.View that houses the shared content of every page (e.g. header, footer, etc)

## Documentation Index

* [Basic Usage](#basic-usage)
* [The Layout Template](#the-layout-template)
* [Setting a Default Page Title](#setting-a-default-page-title)
* [Using Environment Config In Template](#using-environment-config-in-template)
* [Fetching Data for Your Layout](#fetching-data-for-your-layout)
* [Getting Back to Normal](#getting-back-to-normal)

## Basic Usage
To create a Layout, extend Brisket.Layout:

```js
var Layout = Brisket.Layout.extend();
```

This layout will not actually create a very useful page - it will be a blank screen for the user. Let's add a template.

### The Layout Template
A Layout is an implementation of [Brisket.View](brisket.view.md). Therefore, specifying a template for a layout is the same as for a view - [set up a templating engine](brisket.view.md#setting-a-templating-engine) and add a template. For this example, we'll use the built in [StringTemplateAdapter](brisket.templating.stringtemplateadapter.md):

```js
var Layout = Brisket.Layout.extend({

    template: '<!DOCTYPE html> \
        <html> \
        <head> \
            <title>My first Brisket app</title>
        </head> \
        <body> \
            <main class="main-content"><!-- Views go here --></main> \
        </body> \
        </html>',

    content: '.main-content'

});
```

The Layout's template should be the full html for your pages i.e. it should include doctype, head tag, body tag, etc. When you set a template for you layout, you must specify the `content` property. This property should be a selector pointing to the main content element of the template. In this template, the main content element is the element with the class 'main-content'.

## Setting a Default Page Title
To set a default page title for all pages, set the `defaultTitle` property on your Layout:

```js
var Layout = Brisket.Layout.extend({

    template: '<!DOCTYPE html> \
        <html> \
        <head> \
            <title>My first Brisket app</title>
        </head> \
        <body> \
            <main class="main-content"><!-- Views go here --></main> \
        </body> \
        </html>',

    content: '.main-content',

    defaultTitle: 'My first Brisket app'

});
```

Now every page's page title will be 'My first Brisket app' unless you set a custom title for the page.

## Using Environment Config In Template
You will likely want to expose some data from your [environmentConfig](brisket.createserver.md#environmentConfig) to the Layout template. The `environmentConfig` will be accessible to your Layout's methods as `this.environmentConfig`. Expose the environmentConfig through the logic method ([read here for more details](brisket.view.md#exposing-data-to-a-template)).

```js

var MustacheTemplateAdapter = TemplateAdapter.extend({

    templateToHTML: function(template, data, partials) {
        return Mustache.render(template, data, partials);
    }

});

var Layout = Brisket.Layout.extend({

    templateAdapter: MustacheTemplateAdapter,

    template: '<!DOCTYPE html> \
        <html> \
        <head> \
            <title>My first Brisket app</title>
        </head> \
        <body> \
            <main class="main-content"><!-- Views go here --></main> \
            <div class="environment-some-data"> \
                {{environmentConfig.some}} \
            </div> \
        </body> \
        </html>',

    content: '.main-content',

    logic: function() {
        return {
            environmentConfig: this.environmentConfig
        };
    }

});
```

The template will display the value "data" if environmentConfig is `{ "some": "data" }`.

## Fetching Data for Your Layout
If your layout's display depends on data fetched from an API, implement the `fetchData` method. The return value of your implementation should be a promise. Here's an example:

```js
var MustacheTemplateAdapter = TemplateAdapter.extend({

    templateToHTML: function(template, data, partials) {
        return Mustache.render(template, data, partials);
    }

});

var Model = Brisket.Model.extend({
    url: '/api/model' // returns { some: "modeldata" }
});

var Layout = Brisket.Layout.extend({

    templateAdapter: MustacheTemplateAdapter,

    template: '<!DOCTYPE html> \
        <html> \
        <head> \
            <title>My first Brisket app</title>
        </head> \
        <body> \
            <main class="main-content"><!-- Views go here --></main> \
            <div class="environment-some-data"> \
                {{model.some}} \
            </div> \
        </body> \
        </html>',

    content: '.main-content',

    defaultTitle: 'My first Brisket app',

    model: null,

    fetchData: function() {
        this.model = new Model();

        return q.allSettled([
            model.fetch()
        ]);
    },

    logic: function() {
        return {
            model: this.model.toJSON()
        };
    };

});
```

`fetchData` will be called before the Layout is rendered so the data in `this.model` will be ready for the Layout's template. **Note:** If the promise returned by `fetchData` is rejected, the page will show an error even if the current route executes successfully. Always return a resolved promise to avoid the Layout causing your pages to display errors.

## Getting Back to Normal
As you navigate between routes, your Router code may modify the Layout. Implement a `backToNormal` method on your Layout to tell Brisket what the default state of your Layout looks like.

```js
var SpecialRouter = Brisket.RouterBrewery.create({

    onRender: function(layout) {
        layout.beSpecial();
    }

});

var Layout = Brisket.Layout.extend({

    template: '<!DOCTYPE html> \
        <html> \
        <head> \
            <title>My first Brisket app</title>
        </head> \
        <body> \
            <main class="main-content"><!-- Views go here --></main> \
        </body> \
        </html>',

    content: '.main-content',

    defaultTitle: 'My first Brisket app',

    beSpecial: function() {
        // do some work like add a special class to layout
    },

    beNormal: function() {
        // do some work like removing any special class on layout
    },

    backToNormal: function() {
        this.beNormal();
    }

});
```

In this example, when you go to any route in SpecialRouter, the layout will become special. When you navigate to a route that is outside of SpecialRouter, you want the layout to be normal. You also don't want to implement an `onRender` for every Router. `backToNormal` will execute before every route so that the layout is normal before doing an Router-specific work.

Using `backToNormal` plus `onRender`, you can do things like highlight the current menu item, update the logo between Routers, etc.
