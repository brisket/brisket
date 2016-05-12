Data Modeling
================

Brisket makes standard Backbone modeling tools (`Backbone.Model` and `Backbone.Collection`) environment agnostic.

## Documentation Index

* [Fetching Data](#fetching-data)

## Fetching Data

In your app's `Backbone.Model`s and `Backbone.Collection`s, fetch data from the [apis that you specify when you create a Brisket server](brisket.createserver.md#apis):

```js
var MyModel = Backbone.Model.extend({
    url: '/api/path/to/model-data'
});

var MyCollection = Backbone.Collection.extend({
    url: '/other-api/path/to/collection-data'
});
```

The prefix for the url property should be the api that you want to request data from.

**Note:** The api prefix of the url does not need to change if you [mount your application on a subdirectory of your domain](brisket.createserver.md#environmentconfigapproot).

