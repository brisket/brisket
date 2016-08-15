Brisket.createServer
==================
Use Brisket.createServer to create a Brisket express engine that you can use in your express servers.

## Documentation Index

* [Required Configuration Options](#required-configuration-options)
* [Optional Configuration Options](#optional-configuration-options)

## Required Configuration Options
`createServer` takes parameters so that you can customize your app. Here are the required options:

#### apis
Use apis configuration to specify the apis that your application will hit:

```js
apis: {
    'api': { host: 'http://api.example.com', proxy: 'http://proxy.example.com' }
    'other-api': { host: 'http://other-api.example.com' }
}
```

For each api, you can specify the host and proxy. Brisket automatically adds a middleware (relative to your app's root) for each api to handle client side ajax calls. Your app's `Backbone.Model`s and `Backbone.Collection`s can [fetch data from the apis you specify](modeling.md#fetch-data).

## Optional Configuration Options

#### environmentConfig
`environmentConfig` is a hash of key/values that will be available to all application initializers. `environmentConfig` will be available as `options.environmentConfig`:

```js
var App = Brisket.App;

App.addServerInitializer(function(options) {
    var environmentConfig = options.environmentConfig;
});

var brisketServer = Brisket.createServer({
    apis: {
        'api': { host: 'http://api.example.com' }
    },

    environmentConfig: {
        some: 'data',
    }
});
```

#### environmentConfig.appRoot
This is the root of your application as far as pushState is concerned. If you deploy your application somewhere other than the root of your server, use this setting to tell Brisket where it is. This will be passed to [Backbone.start](http://backbonejs.org/#History-start)

```js
var brisketServer = Brisket.createServer({
    apis: {
        'api': { host: 'http://api.example.com' }
    },

    environmentConfig: { appRoot: '/path/to/app/' }
});
```

#### serverConfig
`serverConfig` is a hash of key/values that will **ONLY** be available to your App's server initializers. In the server initializers, `serverConfig` will be available as `options.serverConfig`:

```js
var App = Brisket.App;

App.addServerInitializer(function(options) {
    var environmentConfig = options.environmentConfig;
});

var brisketServer = Brisket.createServer({
    apis: {
        'api': { host: 'http://api.example.com' }
    },

    serverConfig: { some: 'data' }
});

App.addClientInitializer(function(options) {
    console.log(options.serverConfig); // undefined
});
```

`serverConfig` is a good place to put any values that your end-users should not see but are necessary to run the server.

#### debug
Set `debug` to true to enable instrumentation with [Backbone Debugger](https://chrome.google.com/webstore/detail/backbone-debugger/bhljhndlimiafopmmhjlgfpnnchjjbhd?hl=en):

```
var brisketServer = Brisket.createServer({
    apis: {
        'api': { host: 'http://api.example.com' }
    },
    debug: true
});
```

Once you install the extension and set `debug` true, you can [use the debugger in your inspector](https://github.com/Maluen/Backbone-Debugger#screenshots)
