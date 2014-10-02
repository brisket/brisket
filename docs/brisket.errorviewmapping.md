Brisket.ErrorViewMapping
======================
A mapping between the error status code your models receive from the api and a View. Use an ErrorViewMapping in your routers to tell Brisket what to display when there is an error while retrieving data.

## Creating An ErrorViewMapping
Creating an ErrorViewMapping is fairly straightforward:

```js
var PageNotFoundView = Brisket.View.extend();
var EndOfTheWorldView = Brisket.View.extend();

var ErrorViewMapping = Brisket.ErrorViewMapping.create({

    404: PageNotFoundView,

    500: EndOfTheWorldView

});
```

In this example, if there is a 404 error, the ErrorViewMapping will tell your Router to use PageNotFoundView; if there is a 500, EndOfTheWorldView.

**Note:** When an ErrorViewMapping does not have a mapping for a status code, it will return the error view for a 500. Therefore, you must specify at least a 500 error view.
