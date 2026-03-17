Tracking Page View
========================

If you need to track a page view, use [request.onComplete](../brisket.requestobject.md#requestoncompletefn), and [request properties](../brisket.requestobject.md#whats-in-the-request-object):

```js
import ga from 'path/to/GoogleAnalyticsLibrary.js';
import BookView from 'path/to/BookView.js';

const BookRouter = Brisket.Router.extend({

  routes: {
    'books/:bookId': 'books',
  },

  book(bookId, layout, request, response) {

    request.onComplete(function() {
      ga("set", "referrer", request.referrer);
      ga("set", "location", request.path);
      ga("set", "bookId", bookId);
      ga("send", "pageview");
    });

    return new BookView();
  },

});
```

You should use request.onComplete callback because a) if you were to call tracking code outside of a callback, it would throw an error when it executes on the server, and b) Brisket will call the `request.onComplete` callback only when the route is visible to the user.
