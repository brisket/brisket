Fetching Multiple Models
========================

Let's say you had to build a simple page that only displays the details about a `Book`. You would fetch the
details about the `Book` and then return a `BookView`:

```js
var BookRouter = RouterBrewery.create({

    "book/:id": "book",

    book: function(id) {
        var book = new Book({ id: id });

        return book.fetch().then(function() {
            return new BookView({ model: book });
        });
    }

});
```

But now you need to render a list of `Comments` about the `Book`. Since your `Comment` data is serve
from another endpoint, you have to fetch the `Book` and it's `Comments` separately. Using
[Bluebird](https://github.com/petkaantonov/bluebird), here's what you can do:


```js
var Book = require("./your/path/to/Book");
var BookView = require("./your/path/to/BookView");
var CommentCollection = require("./your/path/to/CommentCollection");
var Promise = require("bluebird");

var BookRouter = RouterBrewery.create({

  "book/:bookId": "book",

  book: function(bookId) {
    var book = new Book({ id: bookId });
    var commentCollection = new CommentCollection({ bookId: bookId });

    return Promise.all([
        book.fetch(),
        commentCollection.fetch()
      ])
      .then(function() {
        return new BookView({
          model: book,
          comments: commentCollection
        });
      });
    }

});
```

`Promise.all` creates a new promise from the array of promises `book.fetch()` and `commentCollection.fetch()`.
The `then` callback will be fired only when both fetches have completed successfully. If they do, you will
return a BookView that is populated with the `Book` and its `Comments`. However, if either fetch fails, Brisket
will render an error page.

If successfully fetching the comments is more of a nice to have, you can do:


```js
var Book = require("./your/path/to/Book");
var BookView = require("./your/path/to/BookView");
var CommentCollection = require("./your/path/to/CommentCollection");
var Promise = require("bluebird");

var BookRouter = RouterBrewery.create({

  "book/:bookId": "book",

  book: function(bookId) {
    var book = new Book({ id: bookId });
    var commentCollection = new CommentCollection({ bookId: bookId });

    return Promise.settle([
        book.fetch(),
        commentCollection.fetch() // might fail, and that's ok
      ])
      .then(function(results) {
        var bookFetched = results[0];

        if (bookFetched.isRejected()) {  // verify that book was fetched successfully
            throw bookFetched.reason();  // if not, rethrow the reason the fetch failed
        }

        return new BookView({
          model: book,
          comments: commentCollection
        });
      });
    }

});
```

`Promise.settle` creates a promise that returns when all the fetches have completed regardless if
they failed. We have to manually fail the route if fetching the `Book` failed.
