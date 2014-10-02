Brisket.Routers
=============

Brisket Routers are the main entry point to any Brisket app. Brisket.Routers helps you initialize your app's Routers. It's not required to use this helper - you can initialize your Routers yourself if you choose.

This helper saves you having to think about how to initialize your routers.

## Documentation Index

* [Simple Usage](#simple-usage)
* [Specify A Catchall Router](#specify-a-catchall-router)

## Simple Usage

```js
var Routers = Brisket.Routers.toUse({

    routers: [
        require('../foo/FooRouter'),
        require('../bar/BarRouter'),
        require('../baz/BazRouter')
    ]

});
```

## Specify A Catchall Router

If one of your router has a catch all route matcher (e.g. *undefined), specify it as the CatchAllRouter to ensure that it is initialized first.

```js
var Routers = Brisket.Routers.toUse({

    CatchAllRouter: require('../application/ApplicationRouter'),

    routers: [
        require('../foo/FooRouter'),
        require('../bar/BarRouter'),
        require('../baz/BazRouter')
    ]

});
```
