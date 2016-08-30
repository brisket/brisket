Handling Errors in a Route Handler
========================

The documentation for Brisket.Router talks about [how to handle errors generally for all actions in a Router](https://github.com/bloomberg/brisket/blob/master/docs/brisket.router.md#handling-errors). You can also handle errors on a per route basis:

```js
const ErrorView = Brisket.View.extend();

const ErrorViewMapping = Brisket.ErrorViewMapping.create({
  500: ErrorView
});

const BookRouter = Brisket.Router.extend({

  errorViewMapping: ErrorViewMapping

  routes: {
    "books/:id": "book",
    "library": "library"
  },

  /*
   * The "book" route throws an error so Brisket displays ErrorView.
   */
  book(id) {
    const book = new Book({ id: id });

    return book.fetch()
      .then(() => {
        throw new Error("There is some problem");

        return new BookView({ model: book });
      });
  },

  /*
   * when collection fetch is successful in library route, show a LibraryView
   * when collection fetch fails, show a BrokenLibraryView instead of the
   *  standard ErrorView
   */
  library(layout, request, response) {
    const bookCollection = new BookCollection();

    return bookCollection.fetch()
      .then(() => {
        return new LibraryView({ collection: bookCollection });
      })
      .catch(() => {
        response.status(500);

        return new BrokenLibraryView(); // shows busted shelves
      });
  }

});
```

When we catch the error in the `library` route, we can set the response status and what View to render. If we don't catch the error, Brisket will show the ErrorView just like in the `book` route. Using this technique, we can have very fine grain control:

```js
const ErrorView = Brisket.View.extend();

const ErrorViewMapping = Brisket.ErrorViewMapping.create({
  500: ErrorView
});

const BookRouter = Brisket.Router.extend({

  errorViewMapping: ErrorViewMapping

  routes: {
    "library": "library"
  },

  library(layout, request, response) {
    const bookCollection = new BookCollection();

    return bookCollection.fetch()
      .then(function() {
        return new LibraryView({ collection: bookCollection });
      })
      .catch(function(xhr, status, error) {
        if (status === 410) {
            response.status(410);

            return new GoneLibraryView(); // shows a void
        }

        throw error; // rethrow error so that Brisket will show ErrorView
      });
  }

});
```

In this case, we can handle the error and make a decision based on the status. If we get an unexpected status, we can rethrow the error to let Brisket show the default error view.
