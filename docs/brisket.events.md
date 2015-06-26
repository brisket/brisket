Brisket.Events
===========

Brisket provides a proxy to Backbone.Events that exposes a noop on the server to help reduce server-side memory leaks. 

## Documentation Index

* [Basic Usage](#basic-usage)

## Basic Usage
By default Brisket.Events is already mixed into Brisket.Views. For all other use cases, simply extend from Brisket.Events instead of Backbone.Events:

```js
var EventBus = _.clone(Brisket.Events);
var object = _.extend({}, Brisket.Events);
```
