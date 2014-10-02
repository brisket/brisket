Brisket.Templating.compiledHoganTemplateAdapter
=============================================

An implementation of [Brisket.Templating.TemplateAdapter](brisket.templating.templateadapter.md) that uses a View's `template` field to find the template in a hash of compiled templates. This TemplateAdapter also expects that you use the View's partials field to specify the template's partials.

## Usage
To use the compiledHoganTemplateAdapter for a View, you must create a compiled templates object, and specify that you want to use it in your View:

```js
var templates = {
    'article': new Hogan.Template(...),
    // actual template is "article by {{> authorPartial}}"

    'author': new Hogan.Template(...)
    // actual template is "author name"
}

var View = Brisket.View.extend({

    templateAdapter: Brisket.Templating.compiledHoganTemplateAdapter(templates)

});

var HoganifiedView = View.extend({

    template: 'article',

    partials: {
        'authorPartial': 'author'
    }

});

var view = new HoganifiedView();
console.log(view.render().el.innerHTML); // 'article by author name'
```

The compiledHoganTemplateAdapter finds the article template in the templates object. When it has to find the partial "authorPartial", it looks it up in the templates hash by the value in the partials hash - "author".

The compiledHoganTemplateAdapter also passes your View's data to the template:

```js
var templates = {
    'article': new Hogan.Template(...),
    // actual template is "{{headline}} by {{> authorPartial}}"

    'author': new Hogan.Template(...)
    // actual template is "{{author}}"
}

var View = Brisket.View.extend({

    templateAdapter: Brisket.Templating.compiledHoganTemplateAdapter(templates)

});

var HoganifiedView = View.extend({

    template: 'article',

    partials: {
        'authorPartial': 'author'
    }

});

var model = new Brisket.Model();
model.set('headline', 'Story 1');
model.set('author', 'wawjr3d');

var view = new HoganifiedView({ model: model });
console.log(view.render().el.innerHTML); // 'Story 1 by wawjr3d'
```
