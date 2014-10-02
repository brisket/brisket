Brisket.ClientApp
===============

Brisket.ClientApp is the place to configure and start your app on the client. This is the best place to initialize any code that only works on the client (e.g. jquery plugins). This is also a good place to set up client-side tracking.

## Documentation Index

* [Configuring Your App](#configuring-your-app)
* [Setting Up jQuery Plugins](#setting-up-jquery-plugins)
* [Setting Up Routers](#setting-up-routers)

## Configuring Your App
To configure your app on the client, implement a `start` method on your ClientApp. You can also use the `start` method as a place to initialize your Routers. The Brisket client app start up script will call your ClientApp's `start` method with `options`. `options` has a field called `environmentConfig` that is the same config that you passed to your Brisket express engine. **Note:** implementing a `start` method is optional. Your ClientApp will still work without a custom `start` method.

```js
var ClientSideModule = {

    someData: null,

    init: function(someData) {
        this.someData = someData;
    },

    execute: function() {
        return window.location + " " + this.someData;
    }

};

var ClientApp = Brisket.ClientApp.extend({

    start: function(options) {
        var environmentConfig = options.environmentConfig;

        ClientSideModule.init(environmentConfig.someData);

        new SomeRouter();
    }

});
```

### Setting Up jQuery Plugins
Another common use case is "Where do I put my jQuery plugins in Brisket?". The ClientApp is the place to initialize them so that they don't throw errors on the server. Here is an example using browserify:

```js

var ClientApp = Brisket.ClientApp.extend({

    start: function() {
        var $ = require('jquery');
        require('jquery.waypoints');
    }

});
```

If you use browserify or require to encapsulate your ClientApp, you could also require the plugins at the top of your ClientApp's file because your ClientApp's file will not be executed on the server.


## Setting Up Routers
Brisket provides [Brisket.Routers](brisket.routers.md) as a convenience to help you initialize your routers. To use your Brisket.Routers, set the routers field on your ClientApp. The ClientApp will initialize your Routers for you.

```js
var Routers = Brisket.Routers.toUse({

    routers: [
        require('../foo/FooRouter'),
        require('../bar/BarRouter'),
        require('../baz/BazRouter')
    ]

});

var ClientSideModule = {

    someData: null,

    init: function(someData) {
        this.someData = someData;
    },

    execute: function() {
        return window.location + " " + this.someData;
    }

};

var ClientApp = Brisket.ClientApp.extend({

    routers: Routers,

    start: function(options) {
        var environmentConfig = options.environmentConfig;

        ClientSideModule.init(environmentConfig.someData);
    }

});
```
