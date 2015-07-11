Brisket.Collection
================

An environment agnostic implementation of Backbone.Collection.

## Documentation Index

* [Simple Usage](#simple-usage)
* [Setting Up A BaseCollection](#setting-up-a-basecollection)
* [Routing to apiHost](#routing-to-apihost)

## Simple Usage

To create a Collection, just extend from Brisket.Collection the same way you would a Backbone.Collection.

```js
var MyModel = Brisket.Collection.extend();
```

## Setting Up A BaseCollection

While you can extend from Brisket.Collection directly to build any Models that your site needs, it may make sense to set up a BaseCollection for your site that provides application-specific features to all of your application's Collections.

```js
var BaseCollection = Brisket.Collection.extend({
    someFeature: function() {
        return this.id;
    }
});

var AppFooCollection = BaseCollection.extend();

var appFooCollection = new AppFooCollection({ id: "example" });

appFooCollection.someFeature(); // example
```

## Routing to apiHost

Any collection request received by Brisket with ```/api``` as a prefix will be rerouted to the [apiHost](brisket.createserver.md#apihost).
