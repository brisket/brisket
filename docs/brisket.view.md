Brisket.View
==========

An extension of Backbone.View that provides a Rendering Workflow, Child View Managment, and helpful rendering callbacks.

## Documentation Index

* [Rendering A View](#rendering-a-view)
* [Events](#events)
* [Setting A Templating Engine](#setting-a-templating-engine)
* [Exposing Data to A Template](#exposing-data-to-a-template)
* [Creating Child Views](#creating-child-views)

## Rendering A View

In a typical Backbone app, you have to implement your Views' `render` methods. Generally that looks something like this:

```js
var View = Backbone.View.extend({
    render: function() {
        this.el.innerHTML = 'some content';

        return this;
    }
});
```

In Brisket, we hijack the `render` method to keep your Views environment agnostic. When `render` is called on a Brisket.View, you can expect that the `template` that you have specified in your View definition will be rendered into your View's internal `el`. The Brisket implementation of `render` also returns the view so that you can chain. For example:

```js
var View = Brisket.View.extend({
    template: '<div class="myView">some content</div>'
});

var view = new View();
console.log(view.render().el.innerHTML); // '<div class="myView">some content</div>'
```

But what if you want to do more complex work than simply rendering the template that is specified (e.g. pick a different template, some post processing, etc)?

Instead of having you override the `render` method, Brisket provides several callbacks that you can use to set up content in your views:

### beforeRender
Use `beforeRender` to set up data, queue up child views, and/or pick a template to use before Brisket renders the View's template into the `el`. `beforeRender` is called on both the client AND the server.

### afterRender
Use `afterRender` to modify your view after Brisket has rendered the View's template into the `el`. This is useful if you have to do some work (e.g. add a special class) that can only be done once the template has been rendered. `afterRender` is called on both the client AND the server.

### onDOM
Use the `onDOM` callback to make changes to your view when it has entered the DOM in the browser. This callback is useful as a place where you can safely expect a `window` object to be available. So if you need to use a jquery plugin that only works in a browser, for example, this is the place to do it. `onDOM` is called on the client but NOT the server.


During a View's [Rendering Workflow](rendering.workflow.md), on both the server AND client, you can expect that `beforeRender` will be called before `afterRender`. On the client, `onDOM` will be called only when the View enters the DOM - that will always occur `afterRender`.

## Events

### 'on-dom'
Triggers when the View enters the DOM.

```js
var view = new Brisket.View();

view.on('on-dom', function() {
  // do something now that view has entered dom;
});
```

### 'close'
Triggers when the View is closed.

```js
var view = new Brisket.View();

view.on('close', function() {
  // do something when view is closed
});
```

## Setting A Templating Engine
By default, all Brisket.Views use [Brisket.Templating.StringTemplateAdapter](brisket.templating.stringtemplateadapter.md) to render templates. To specify a TemplateAdapter other than the default, set the templateAdapter field on a View:

```js
var AddsSmilesTemplateAdapter = TemplateAdapter.extend({

    templateToHTML: function(template, data) {
        return template + ' :) :)';
    }

});

var SmileView = Brisket.View.extend({

    templateAdapter: AddsSmilesTemplateAdapter,

    template: '3 smiles look like :)'

});

var view = new SmileView();
console.log(view.render().el.innerHTML); // '3 smiles look like :) :) :)'
```

## Exposing Data to A Template

With just about every templating engine, you will end up passing data from your View to your template. Since Brisket hijacks the `render` method, it takes care of passing data to your Views' templates.

By default, Brisket will pass a json representation (model.toJSON()) of the View's `model` to the template as data. Using Mustache as an example:

```js
var MustacheTemplateAdapter = TemplateAdapter.extend({

    templateToHTML: function(template, data, partials) {
        return Mustache.render(template, data, partials);
    }

});

var Model = Backbone.Model.extend();

var View = Brisket.View.extend({

    templateAdapter: MustacheTemplateAdapter,

    template: '{{field}}'

});

var model = new Model();
model.set('field', 'data');

var view = new View({ model: model });
console.log(view.render().el.innerHTML); // 'data'
```

While the data in your model may be sufficient to construct the template, sometimes you want to send additional data to the template from the View. Use the `logic` callback to send additional data to the View.

```template
// my/template

{{field}} {{fromLogic}}
```

```js
var MustacheTemplateAdapter = TemplateAdapter.extend({

    templateToHTML: function(template, data, partials) {
        return Mustache.render(template, data, partials);
    }

});

var Model = Backbone.Model.extend();

var View = Brisket.View.extend({

    templateAdapter: MustacheTemplateAdapter,

    template: '{{field}} {{fromLogic}}',

    logic: function() {
        return {
            fromLogic: 'otherData'
        };
    }
});

var model = new Model();
model.set('field', 'data');

var view = new View({ model: model });
console.log(view.render().el.innerHTML); // 'data otherData'
```

Brisket combines the data in the View's `model` AND the data provided by the `logic` function.

In some cases however you may not have a Backbone.Model as the `model` but you have another object that you want to be the data that is sent to the template. Brisket provides a callback called `modelForView` that you can use as the View's template data. With `modelForView` you can use a ViewModel that you've dedicated to your View or a plain object that you construct in-place:

```template
// my/template

{{fromCustomModel}}
```

```js
var MustacheTemplateAdapter = TemplateAdapter.extend({

    templateToHTML: function(template, data, partials) {
        return Mustache.render(template, data, partials);
    }

});

var Model = Backbone.Model.extend();

var View = Brisket.View.extend({

    templateAdapter: MustacheTemplateAdapter,

    template: '{{fromCustomModel}}',

    modelForView: function() {
        return {
            fromCustomModel: 'customData'
        };
    }
});

var model = new Model();
var view = new View();
console.log(view.render().el.innerHTML); // 'customData'
```

Just as before with a real `model`, Brisket combines the data from the View's `modelForView` AND the data provided by the `logic` function.

**Note:** If your View has a `model` AND you define a `modelForView`, the `modelForView` will take precendence and the `model` will be ignored.

## Creating Child Views
Please go [**here**](brisket.childviews.md) to read about child views.
