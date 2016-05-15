Jump To Top Of Page On New Route
================================

```js
var BaseRouter = Brisket.Router.extend({

  onRouteComplete: function(layout, request) {

    // Not scrolling on the first request makes refreshing the page
    // feel more natural
    if (request.isFirstRequest) {
        return;
    }

    window.scrollTo(0, 0);
  }

});

var BookRouter = BaseRouter.extend({
   ...
});

```
