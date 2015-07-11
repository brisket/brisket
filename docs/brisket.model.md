Brisket.Model
===========

An environment agnostic implementation of Backbone.Model.

## Documentation Index

* [Simple Usage](#simple-usage)
* [Setting Up A BaseModel](#setting-up-a-basemodel)
* [Routing to apiHost](#routing-to-apihost)

## Simple Usage

To create a Model, just extend from Brisket.Model the same way you would a Backbone.Model.

```js
var MyModel = Brisket.Model.extend();
```

## Setting Up A BaseModel

While you can extend from Brisket.Model directly to build any Models that your site needs, it may make sense to set up a BaseModel for your site that provides application-specific features to all of your application's Models.

```js
var BaseModel = Brisket.Model.extend({
    someFeature: function() {
        return this.id;
    }
});

var AppFoo = BaseModel.extend();

var appFoo = new AppFoo({ id: "example" });

appFoo.someFeature(); // example
```

## Routing to apiHost

Any model request received by Brisket with ```/api``` as a prefix will be rerouted to the [apiHost](brisket.createserver.md#apihost).
