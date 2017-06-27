Brisket.Layout
============

A specialized Brisket.View that houses the shared content of every page (e.g. header, footer, etc)

## Documentation Index

* [Basic Usage](#basic-usage)
* [The Layout Template](#the-layout-template)
* [Using Environment Config In Template](#using-environment-config-in-template)
* [Fetching Data for Your Layout](#fetching-data-for-your-layout)
* [Setting Layout State From a Route](#setting-layout-state-from-a-route)
* [Changing Layout Data Between Routes](#changing-layout-data-between-routes)
* [Setting a Default Page Title](#setting-a-default-page-title)

## Basic Usage
To create a Layout, extend Brisket.Layout:

```js
const Layout = Brisket.Layout.extend();
```

This layout will not actually create a very useful page - it will be a blank screen for the user. Let's add a template.

### The Layout Template
A Layout is an implementation of [Brisket.View](brisket.view.md). Therefore, specifying a template for a layout is the same as for a view - [set up a templating engine](brisket.view.md#setting-a-templating-engine) and add a template. For this example, we'll use the built in [StringTemplateAdapter](brisket.templating.stringtemplateadapter.md):

```js
const Layout = Brisket.Layout.extend({

    template: `
        <!DOCTYPE html>
        <html>
        <head>
            <title>My first Brisket app</title>
        </head>
        <body>
            <main class='main-content'><!-- Views go here --></main>
        </body>
        </html>
    `,

    content: '.main-content'

});
```

The Layout's template should be the full html for your pages i.e. it should include doctype, head tag, body tag, etc. When you set a template for you layout, you must specify the `content` property. This property should be a selector pointing to the main content element of the template. In this template, the main content element is the element with the class 'main-content'.

## Using Environment Config In Template
You will likely want to expose some data from your [environmentConfig](brisket.createserver.md#environmentConfig) to the Layout template. The `environmentConfig` will be accessible to your Layout's methods as `this.environmentConfig`. Expose the environmentConfig through the logic method ([read here for more details](brisket.view.md#exposing-data-to-a-template)).

```js
const Layout = Brisket.Layout.extend({

    initialize() {
        console.log(this.model.get("environmentConfig").some); // data
    },

    template({ environmentConfig }) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>My first Brisket app</title>
            </head>
            <body>
                <main class='main-content'><!-- Views go here --></main>
                <div class='environment-some-data'>
                    ${ environmentConfig.some }
                </div>
            </body>
            </html>
        `;
    },

    content: '.main-content'

});
```

The template will display the value 'data' if environmentConfig is `{ 'some': 'data' }`.

## Fetching Data for Your Layout
If your layout's display depends on data fetched from an API, implement the `fetchData` method. The return value of your implementation should be a promise. Here's an example:

```js
const Model = Backbone.Model.extend({
    url: '/api/model' // returns { some: 'modeldata' }
});

const Layout = Brisket.Layout.extend({

    template({ navModel }) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>My first Brisket app</title>
            </head>
            <body>
                <main class='main-content'><!-- Views go here --></main>
                <div class='environment-some-data'>
                    ${ navModel.some }
                </div>
            </body>
            </html>
        `;
    },

    content: '.main-content',

    fetchData: function() {
        this.navModel = new Model();

        return q.allSettled([
            navModel.fetch()
        ]);
    },

    logic: function() {
        return {
            navModel: this.navModel.toJSON()
        };
    };

});
```

`fetchData` will be called before the Layout is rendered so the data in `this.navModel` will be ready for the Layout's template. **Note:** If the promise returned by `fetchData` is rejected, the page will show an error even if the current route executes successfully. Always return a resolved promise to avoid the Layout causing your pages to display errors.

## Setting Layout State From a Route
Use `setLayoutData` in a route to pass data to your route's Layout:

```js
const Layout = Brisket.Layout.extend({

    initialize() {
        console.log(this.model.get('key')); // 'value from route'
        console.log(this.model.get('key2')); // 'value2 from route'
        console.log(this.model.get('key3')); // 'value3 from route'
    },

    content: '.main-content',

    template({ key }) {
        return `<div class='main-content'>${ key }</div>`;
    }

});

const Router = Brisket.Router.extend({

    layout: Layout,

    routes: {
        'route': 'route'
    },

    route: function(setLayoutData) {
        setLayoutData('key', 'value from route');
        setLayoutData({
            'key2': 'value2 from route',
            'key3': 'value3 from route'
        });

        return new Brisket.View();
    }

});
```

Setting Layout data is useful when you need to fetch different data or render different content based on the route's context.

## Changing Layout Data Between Routes
As you navigate between routes, your route handlers may modify the Layout's state. Implement a change event handler in your Layout to respond to changes.

```js
const Layout = Brisket.Layout.extend({

    initialize() {
        this.model.on({
            'change:be': updateBe
        }, this);
    },

    content: '.main-content',

    template({ be = 'normal' }) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>My first Brisket app</title>
            </head>
            <body class='be-${ be }'>
                <main class='main-content'><!-- Views go here --></main>
            </body>
            </html>`;
    }

});

function updateBe(model, be = 'normal') {
    document.body.className = document.body.className.replace(/be-[^\b]+/, `be-${ be }`);
}

const SpecialRouter = Brisket.Router.extend({

    layout: Layout,

    routes: {
        'normal': 'handleNormal',
        'special': 'handleSpecial'
    },

    handleNormal() {
        return new Brisket.View();
    }

    handleSpecial(setLayoutData) {
        setLayoutData('be', 'special');

        return new Brisket.View();
    }

});
```

In this example, when you go to the normal route, the layout will render 'be-normal' class on the body tag. Then when you navigate in the browser to the special route, the layout will update the body className to replace 'be-normal' with 'be-special'. Now when you navigate back to the normal route, the class name will update back to 'be-normal'.

## Setting a Default Page Title
To set a default page title for all pages, use layout data:

```js
const Layout = Brisket.Layout.extend({

    initialize() {
        this.model.on({
            'change:be': updateBe,
            'change:title': updateTitle
        }, this);
    },

    content: '.main-content',

    template({ be = 'normal', title = 'My Site' }) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${ title }</title>
            </head>
            <body class='be-${ be }'>
                <main class='main-content'><!-- Views go here --></main>
            </body>
            </html>
        `;
    }

});

function updateBe(model, be = 'normal') {
    document.body.className = document.body.className.replace(/be-[^\b]+/, `be-${ be }`);
}

function updateTitle(model, title = 'My Site') {
    document.title = title;
}

const Router = Brisket.Router.extend({

    layout: Layout,

    routes: {
        'normal': 'handleNormal',
        'special': 'handleSpecial'
    },

    handleNormal() {
        return new Brisket.View();
    }

    handleSpecial(setLayoutData) {
        setLayoutData({
            'title': 'Special page',
            'be': 'special'
        });

        return new Brisket.View();
    }

});
```

In this example, when you navigate directly to the 'normal' route, which does not set the title property for the layout, the page title will be the default title - 'My Site'. When you navigate to directly to the 'special' route, the page title will be 'Special page'. Thanks to the change handler in the initializer, the page title will also update as you navigate between these routes in the browser. Setting up a change handler for the title is completely optional.

You can use this same technique to set up other metatags, which need to update dynamically.

**Note:** If you're going to have dynamic data in your meta tags, you should escape the content of your tags to be safe. [escape-html](https://www.npmjs.com/package/escape-html) is a simple package you can use for safe escaping.