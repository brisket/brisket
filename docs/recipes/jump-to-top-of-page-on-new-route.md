Jump To Top Of Page On New Route
================================

```js
const BaseRouter = Brisket.Router.extend({

  onRouteComplete(layout, request) {
    // Not scrolling on the first request makes refreshing the page
    // feel more natural
    if (request.isFirstRequest) {
      return;
    }

    window.scrollTo(0, 0);
  },

});

const BookRouter = BaseRouter.extend({
   ...
});

```
