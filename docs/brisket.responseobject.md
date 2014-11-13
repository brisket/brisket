Brisket Response Object
======================

The last parameter of every route handler is a Brisket response object - an environment agnostic set of tools for modifying the current resposne.

## Documentation Index

* [Accessing the Response Object](#accessing-the-response-object)
* [What's in the Response Object?](#whats-in-the-response-object)

## Accessing the Response Object

### Last parameter of a route handler

```js
var BookRouter = Brisket.RouterBrewery.create({

  routes: {
    'books': 'books',
    'books/:id': 'book'
  },

  books: function(request, response) {
    response.status(201); // server will respond with 201

    return new BookView();
  },

  book: function(id, request, response) {
    var book = new Book({ id: id });

    response.status(204); // server will respond with 204

    return book.fetch()
      .then(function() {
        return new BookView({ model: book });
      });
  }

});
```

### Third parameter of onRouteStart callback

```js
var RouterBrewery = Brisket.RouterBrewery.makeBreweryWithDefaults({

  onRouteStart: function(layout, request, response) {
    response.status(202); // current history will be replaced with 'another/route'
  }

});
```


## What's in the Request Object?
Here is a listing of all the tools provided by the Brisket response object.

### response.status(statusCode)
Use this method to set the statusCode for the current response.

### response.redirect([statusCode, ] destination)
Use this method to redirect the current response to another uri. Example usage:

```js
response.redirect('foo/bar');
response.redirect('/foo/bar');
response.redirect('http://example.com');
response.redirect(301, 'http://example.com');
```
