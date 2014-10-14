Brisket.RouterBrewery
===================

Use a Brisket.RouterBrewery to create a [Brisket Router](brisket.router.md) for your application.

## Documentation Index

* [Creating Brisket Routers](#creating-brisket-routers)
* [Creating Your Own RouterBrewery](#creating-your-own-routerbrewery)

## Creating Brisket Routers
To create a Brisket Router that will handle user requests, use a RouterBrewery's create method:

```js
var BookRouter = Brisket.RouterBrewery.create({

  routes: {
    "books": "books",
    "books/:id": "book"
  },

  books: function() {
    return new BookView();
  },

  book: function(id) {
    var book = new Book({ id: id });

    return book.fetch()
      .then(function() {
        return new BookView({ model: book });
      });
  }

});
```

Creating a Brisket Router is very similar to creating a Backbone.Router. The key difference here is you call RouterBrewery.create method rather than Backbone.Router.extend method.

For the full list of differences, read the [Brisket Router](brisket.router.md) doc.

## Creating Your Own RouterBrewery
In most apps, you'll want to create your own RouterBrewery so that you can set site-wide defaults:

```js
var RouterBrewery = Brisket.RouterBrewery.makeBreweryWithDefaults();
```

### Using Your Custom RouterBrewery
Use your custom RouterBrewery just like Brisket.RouterBrewery:

```js
var RouterBrewery = Brisket.RouterBrewery.makeBreweryWithDefaults();

var BookRouter = RouterBrewery.create({

  routes: {
    "books": "books",
    "books/:id": "book"
  },

  books: function() {
    return new BookView();
  },

  book: function(id) {
    var book = new Book({ id: id });

    return book.fetch()
      .then(function() {
        return new BookView({ model: book });
      });
  }

});
```

### Setting A Default Layout
To set a default [Layout](brisket.layout.md) for all Routers created with your RouterBrewery:

```js
var DefaultLayout = Brisket.Layout.extend();

var RouterBrewery = Brisket.RouterBrewery.makeBreweryWithDefaults({

  layout: DefaultLayout

});
```

### Setting Your ErrorViewMapping
To set a default [ErrorViewMapping](brisket.errorviewmapping.md) for all Routers created with your RouterBrewery:

```js
var ErrorView = Brisket.View.extend();

var ErrorViewMapping = Brisket.ErrorViewMapping.create({
  500: ErrorView
});

var RouterBrewery = Brisket.RouterBrewery.makeBreweryWithDefaults({

  errorViewMapping: ErrorViewMapping

});
```

### Executing Code When Routes Begin/End
In many apps, you'll want to fire some code when any route changes e.g. make a loading spinny appear and disappear. To set that up, set the `onRouteStart` and `onRouteComplete` properties of your RouterBrewery. These callbacks will be passed the `layout`:

```js
var RouterBrewery = Brisket.RouterBrewery.makeBreweryWithDefaults({

  onRouteStart: function(layout) {
    layout.doSomething();
  },

  onRouteComplete: function(layout) {
    layout.doSomethingElse();

    // other code e.g. jump to the top of the page
  }

});
```

**Note:** `onRouteStart` and `onRouteComplete` only execute in the browser.
