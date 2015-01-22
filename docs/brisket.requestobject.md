Brisket Request Object
======================

The second to last parameter of every route handler is a Brisket request object - a normalized view of the current request.

## Documentation Index

* [Accessing the Request Object](#accessing-the-request-object)
* [What's in the Request Object?](#whats-in-the-request-object)

## Accessing the Request Object

### Second to last parameter of a route handler

```js
var BookRouter = Brisket.RouterBrewery.create({

  routes: {
    'books': 'books',
    'books/:id': 'book'
  },

  books: function(request, response) {
    console.log(request.host); // 'example.com:8080'

    return new BookView();
  },

  book: function(id, request, response) {
    var book = new Book({ id: id });

    console.log(request.isNotClick); // true/false

    return book.fetch()
      .then(function() {
        return new BookView({ model: book });
      });
  }

});
```

### Second parameter of router callbacks

```js
var RouterBrewery = Brisket.RouterBrewery.makeBreweryWithDefaults({

  onRouteStart: function(layout, request, response) {
    console.log(request.isFirstRequest); // true/false
  },

  onRouteComplete: function(layout, request, response) {
    console.log(request.requestId); // 1, 2, 3,...
  }

});
```


## What's in the Request Object?
Here is a listing of all the data provided by the Brisket request object.

### request.host
The host of the url including the port e.g. 'example.com:8080'.

### request.isFirstRequest
A boolean that let's you know if this is the first request to your Brisket application e.g. the initial request for your application, a page refresh.

### request.isNotClick
A boolean that let's you know if the current request was **NOT** triggered by a user click e.g. forward/back button press.

### request.path
The path of the URL with a preceding '/' e.g. '/path/to/route'.

### request.protocol
The protocol scheme of the URL, **NOT** including the ':' e.g. 'http', 'https'.

### request.rawQuery
The raw query string. It is the same as extracting query string express request.originalUrl.

### request.query
An object with the parsed values from the query string. It is the same as express request.query.

### request.referrer
The full URI of the previous request e.g. previous page, previous click within your application.

### request.requestId
The unique identifier for each request to your application.

### request.userAgent
The user agent string from the user's browser.

### request.environmentConfig
The [environmentConfig](brisket.createserver.md#environmentconfig) that you use to create your Brisket server.
