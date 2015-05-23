Brisket.ServerApp
===============

Brisket.ServerApp is the place to configure and start your app on the server.

## Documentation Index

* [Configuring Your App](#configuring-your-app)
* [Setting Up Routers](#setting-up-routers)

## Configuring Your App
To configure your app on the server, implement a `start` method on your ServerApp. You can also use the `start` method as a place to initialize your Routers. The Brisket express engine will call your ServerApp's `start` method with `options`, an object containing your `environmentConfig` and `serverConfig`. Refer to [Brisket.createServer](brisket.createserver.md) for more information about `start` options. **Note:** implementing a `start` method is optional. Your ServerApp will still work without a custom `start` method.

```js
var ServerApp = Brisket.ServerApp.extend({

    start: function(options) {
        SomeModule.init(options.environmentConfig.someModuleConfig);
        ServerSpecifcModule.init(options.serverConfig.serverSpecificModuleConfig);

        new SomeRouter();
    }

});
```

## Setting Up Routers
Brisket provides [Brisket.Routers](brisket.routers.md) as a convenience to help you initialize your routers. To use your Brisket.Routers, set the routers field on your ServerApp. The ServerApp will initialize your Routers for you.

```js
var Routers = Brisket.Routers.toUse({

    routers: [
        require('../foo/FooRouter'),
        require('../bar/BarRouter'),
        require('../baz/BazRouter')
    ]

});

var ServerApp = Brisket.ServerApp.extend({

    routers: Routers,

    start: function(options) {
        SomeModule.init(options.environmentConfig.someModuleConfig);
    }

});
```
