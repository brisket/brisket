Brisket Response Object
======================

The last parameter of every route handler is a Brisket response object - an environment agnostic set of tools for modifying the current response.

## Documentation Index

* [Accessing the Response Object](#accessing-the-response-object)
* [What's in the Response Object?](#whats-in-the-response-object)

## Accessing the Response Object

### Last parameter of a route handler

```js
const BookRouter = Brisket.Router.extend({

  routes: {
    'books': 'books',
    'books/:id': 'book',
  },

  books(layout, request, response) {
    response.status(201); // server will respond with 201

    return new BookView();
  },

  async book(id, layout, request, response) {
    const book = new Book({ id: id });

    response.status(204); // server will respond with 204

    await book.fetch();
    
    return new BookView({ model: book });
  },

});
```

### Third parameter of onRouteStart callback

```js
const Router = Brisket.Router.extend({

  onRouteStart(layout, request, response) {
    response.status(202); // current history will be replaced with 'another/route'
  },

});
```


## What's in the Request Object?
Here is a listing of all the tools provided by the Brisket response object.

### response.status(statusCode)
Use this method to set the statusCode for the current response.

### response.set(field [, value])
Use this method to set the response's HTTP header `field` to `value`. You can set multiple values by passing an object.

```js
response.set('Content-Type', 'text/plain');

response.set({
  'Content-Type': 'text/plain',
  'Vary': 'Accept-Encoding',
  'ETag': '12345',
});
```

### response.redirect([statusCode, ] destination)
Use this method to redirect the current response to another uri. Example usage:

```js
response.redirect('foo/bar');
response.redirect('/foo/bar');
response.redirect('http://example.com');
response.redirect(301, 'http://example.com');
```
