Tracking Page View
========================

If you need to track a page view, use [request.onComplete](../brisket.requestobject.md#requestoncompletefn), and [request properties](../brisket.requestobject.md#whats-in-the-request-object):

```js
var ga = require("path/to/GoogleAnalyticsLibrary");
var BookView = require("path/to/BookView");

var BookRouter = Brisket.RouterBrewery.create({

  routes: {
    'books/:bookId': 'books'
  },

  books: function(bookId, layout, request, response) {

    request.onComplete(function() {
      ga("set", "referrer", request.referrer);
      ga("set", "location", request.path);
      ga("set", "bookId", bookId);
      ga("send", "pageview");
    });

    return new BookView();
  }

});
```

You should use request.onComplete callback because a) if you were to call tracking code outside of a callback, it would throw an error when it executes on the server, and b) Brisket will call the `request.onComplete` callback only when the route is visible to the user.
