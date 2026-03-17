Fetching Multiple Models
========================

Let's say you had to build a simple page that only displays the details about a `Book`. You would fetch the
details about the `Book` and then return a `BookView`:

```js
const BookRouter = Brisket.Router.extend({

  'book/:id': 'book',

  async book(id) {
    const book = new Book({ id: id });

    await book.fetch();

    return new BookView({ model: book });
  },

});
```

But now you need to render a list of `Comments` about the `Book`. Since your `Comment` data is serve
from another endpoint, you have to fetch the `Book` and its `Comments` separately. Using
[Bluebird](https://github.com/petkaantonov/bluebird), here's what you can do:


```js
import Book from './your/path/to/Book.js';
import BookView from './your/path/to/BookView.js';
import CommentCollection from './your/path/to/CommentCollection.js';

const BookRouter = Brisket.Router.extend({

  'book/:bookId': 'book',

  async book(bookId) {
    const book = new Book({ id: bookId });
    const commentCollection = new CommentCollection({ bookId: bookId });

    await Promise.all([
      book.fetch(),
      commentCollection.fetch(),
    ]);

    return new BookView({
      model: book,
      comments: commentCollection,
    });
  },

});
```

`Promise.all` creates a new promise from the array of promises `book.fetch()` and `commentCollection.fetch()`.
The `then` callback will be fired only when both fetches have completed successfully. If they do, you will
return a BookView that is populated with the `Book` and its `Comments`. However, if either fetch fails, Brisket
will render an error page.

If successfully fetching the comments is more of a nice to have, you can do:


```js
import Book from './your/path/to/Book.js';
import BookView from './your/path/to/BookView.js';
import CommentCollection from './your/path/to/CommentCollection.js';

const BookRouter = Brisket.Router.extend({

  'book/:bookId': 'book',

  async book(bookId) {
    const book = new Book({ id: bookId });
    const commentCollection = new CommentCollection({ bookId: bookId });

    const [{ reason: bookFetchedReason }] = await Promise.allSettled([
      book.fetch(),
      commentCollection.fetch(), // might fail, and that's ok
    ]);

    if (bookFetchedReason) {  // verify that book was fetched successfully
      throw bookFetchedReason;  // if not, rethrow the reason the fetch failed
    }

    return new BookView({
      model: book,
      comments: commentCollection,
    });
  },

});
```

`Promise.settle` creates a promise that returns when all the fetches have completed regardless if
they failed. We have to manually fail the route if fetching the `Book` failed.
