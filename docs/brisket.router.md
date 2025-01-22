Brisket Router vs Backbone.Router
===============================

Brisket.Router are a little different from a standard Backbone.Router. The differences between the two are the key to making Brisket apps work the same on the client and the server.

## Documentation Index

* [Returning a View](#returning-a-view)
* [Handling Errors](#handling-errors)
* [Specifying a Layout](#specifying-a-layout)
* [Communicating With the Layout](#communicating-with-the-layout)
* [Executing Code When Routes Begin/End](#executing-code-when-routes-beginend)
* [Closing a Router](#closing-a-router)

### Returning a View
One of the biggest differences between a Backbone.Router and a Brisket Router is that Brisket Router route handlers return Views. In a typical Backbone app, you would run code to modify the DOM right in the route handlers. In a Brisket app, route handlers should not modify the DOM. Instead they should return a View that should represent the route. Here is an example:

```js
const Book = Backbone.Model.extend({
  urlRoot: '/api/book',
});

const BookView = Brisket.View.extend();

const BookRouter = Brisket.Router.extend({

  routes: {
    'books/:id': 'book',
  },

  async book(id) {
    const book = new Book({ id: id });

    await book.fetch();

    return new BookView({ model: book });
  },

});

// The 'book' route tells Brisket that it wants to display the BookView.
```

### Handling Errors
When there is an error in a Brisket route handler preparing a View, Brisket will fall back to the Router's errorViewMapping. Thrown code errors will show the 500 ErrorView. The Router's errorViewMapping can be shared with many Routers by using a BaseRouter.

```js
const ErrorView = Brisket.View.extend();

const BaseRouter = Brisket.Router.extend({

  errorViewMapping: {
    500: ErrorView,
  },

});

const BookRouter = BaseRouter.extend({

  routes: {
    'books/:id': 'book',
  },

  async book(id) {
    const book = new Book({ id: id });

    await book.fetch();

    throw new Error('There is some problem');

    return new BookView({ model: book });
  },

});

// The 'book' route throws an error so Brisket displays ErrorView.
```

Brisket also handles error responses from the API while fetching data:

```js
const BadRequestView = Brisket.View.extend();
const ErrorView = Brisket.View.extend();

const BaseRouter = Brisket.Router.extend({

  errorViewMapping: {
    400: BadRequestView,
    500: ErrorView,
  },

});

const BookRouter = BaseRouter.extend({

  routes: {
    'books/:id': 'book',
  },

  async book(id) {
    const book = new Book({ id: id });

    return book.fetch(); // API returns 400 response code

    return new BookView({ model: book });
  },

});

// The 'book' route got a 400 response from the API so Brisket displays BadRequestView.
```

Your route handler can also explicitly tell Brisket that you want to display an error view:

```js
const BadRequestView = Brisket.View.extend();
const ErrorView = Brisket.View.extend();

const BaseRouter = Brisket.Router.extend({

  errorViewMapping: {
    400: BadRequestView,
    500: ErrorView,
  },

});

const BookRouter = BaseRouter.extend({

  routes: {
    'books/:id': 'book',
  },

  book(id) {
    return this.renderError(400);
  },

});

// The 'book' route explicitly requested the 400 error view so Brisket displays BadRequestView.
```

### Specifying a Layout
You can specify the Layout for your Router by setting the layout property:

```js
const BookLayout = Brisket.Layout.extend();

const BookRouter = Brisket.Router.extend({

  layout: BookLayout,

  routes: {
    'books/:id': 'book',
  },

  book(id) {
    return new BookView();
  },

});

```

BookView will be rendered in the BookLayout.

### Communicating With the Layout
There are some situations where you what to tell the page's Layout to do something when a route handler executes. An example use case is wanting to highlight the current section in your layout's main navigation when you go to a route. Brisket exposes the route's `layout` to it's route handler. The layout is the first parameter after the params generated from the url:

```js
const BookLayout = Brisket.Layout.extend();

const BookRouter = Brisket.Router.extend({

  layout: BookLayout,

  routes: {
    'books/:id': 'book',
  },

  book(id, setLayoutData) {
    setLayoutData('key', 'book value');

    return new BookView();
  },

});
```

When the 'book' route renders BookView, it will set the Layout's data 'key' to 'book value'. For more details on setting up your Layout to respond to data from the route, see [Setting Layout State From a Route](brisket.layout.md#setting-layout-state-from-a-route)

### Executing Code When Routes Begin/End
You may want to run some code when route handlers fire e.g. make a loading spinny appear and disappear. To set that up, set the `onRouteStart` and `onRouteComplete` properties of your Router. These callbacks will be passed the `layout`:

```js
const BookRouter = Brisket.Router.extend({

  onRouteStart(setLayoutData) {
    setLayoutData('key', 'value');
  },

  onRouteComplete(setLayoutData) {
    setLayoutData('key2', 'value2');
  },

  routes: {
    'books/:id': 'book',
  },

  book(id) {
    /*
     * Overrides layout data's key value - when the route renders, the
     * layout will see 'key' is 'book value'
     */
    setLayoutData('key', 'book value');

    return new BookView();
  },

});
```

**Note:** `onRouteStart` and `onRouteComplete` only execute in the browser.

### Closing a Router
In some cases your route handlers may need to be cleaned up e.g. if you bind to a global event. Use `onClose` to cleanup the route handlers in your router. **Note:** `onClose` will be fired on the client AND the server.


```js
import MyAppsEventBus from '/path/to/my/apps/eventbus.js';

const doSomething = function() {};

const BookRouter = Brisket.Router.extend({

  routes: {
    'books/:id': 'book',
  },

  book(id) {
    MyAppsEventBus.on('some-event', doSomething);

    return new BookView();
  },

  onClose() {
    MyAppsEventBus.off('some-event', doSomething);
  },

});
```
