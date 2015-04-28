Jump To Top Of Page On New Route
================================

```js
var RouterBrewery = Brisket.RouterBrewery.makeBreweryWithDefaults({

  onRouteComplete: function(layout, request) {

    // Not scrolling on the first request makes refreshing the page
    // feel more natural
    if (request.isFirstRequest) {
        return;
    }

    window.scrollTo(0, 0);
  }

});

var BookRouter = RouterBrewery.create({
   ...
});

```
