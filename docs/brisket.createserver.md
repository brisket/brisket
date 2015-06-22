Brisket.createServer
==================
Use Brisket.createServer to create a Brisket express engine that you can use in your express servers.

## Documentation Index

* [Required Configuration Options](#required-configuration-options)
* [Optional Configuration Options](#optional-configuration-options)

## Required Configuration Options
`createServer` takes parameters so that you can customize your app. Here are the required options:

#### apiHost
This is the fully qualified path to the api your Brisket app will hit. This value will be prepended to all model and collection urls during server-side requests.

#### clientAppRequirePath
This option is the path to your ClientApp module. Brisket will use it to find your ClientApp and call start for you on the client.

Here is a valid call to `createServer` with the fewest possible options:

```js
var brisketServer = Brisket.createServer({
    apiHost: 'http://localhost:4000',
    clientAppRequirePath: 'app/ClientApp',
    environmentConfig: {
        clientAppUrl: '//www.myapp.com/application.js'
    }
});
```

## Optional Configuration Options

#### ServerApp
Use this setting to tell your Brisket server which ServerApp to use:

```js
var ServerApp = Brisket.ServerApp.extend({

    start: function(options) {
        var environmentConfig = options.environmentConfig;
    }

});

var brisketServer = Brisket.createServer({
    apiHost: 'http://localhost:4000',
    clientAppRequirePath: 'app/ClientApp',
    environmentConfig: {
        clientAppUrl: '//www.myapp.com/application.js'
    }

    ServerApp: ServerApp
});
```

If you do not pass in a ServerApp, Brisket.ServerApp will be used.

#### environmentConfig
`environmentConfig` is a hash of key/values that will be available to both your ClientApp and ServerApp via the start method. In both Apps, `environmentConfig` will be available as `options.environmentConfig`:

```js
var ServerApp = Brisket.ServerApp.extend({

    start: function(options) {
        var environmentConfig = options.environmentConfig;
    }

});

var brisketServer = Brisket.createServer({
    apiHost: 'http://localhost:4000',
    clientAppRequirePath: 'app/ClientApp',

    ServerApp: ServerApp,
    environmentConfig: {
        some: 'data',
        clientAppUrl: '//www.myapp.com/application.js'
    }
});
```

#### environmentConfig.appRoot
This is the root of your application as far as pushState is concerned. If you deploy your application somewhere other than the root of your server, use this setting to tell Brisket where it is. This will be passed to [Backbone.start](http://backbonejs.org/#History-start)

```js
var brisketServer = Brisket.createServer({
    apiHost: 'http://localhost:4000',
    clientAppRequirePath: 'app/ClientApp',

    ServerApp: ServerApp,
    environmentConfig: { appRoot: '/path/to/app/' }
});
```

#### environmentConfig.clientAppUrl
`environmentConfig.clientAppUrl` is the location of your bundled javascript which Brisket will bootstrap in the browser. Note that this is a required field.

```js
// On the server
var brisketServer = Brisket.createServer({
    apiHost: 'http://localhost:4000',
    clientAppRequirePath: 'app/ClientApp',

    ServerApp: ServerApp,
    environmentConfig: {
        appRoot: '/path/to/app/',
        clientAppUrl: '//www.myapp.com/application.js'
    }
});
```

#### environmentConfig.startClientAppAsync
`environmentConfig.startClientAppAsync` if set to a true will bootstrap the client application in the browser asynchronously. The default is synchronous

```js
var brisketServer = Brisket.createServer({
    apiHost: 'http://localhost:4000',
    clientAppRequirePath: 'app/ClientApp',
    environmentConfig: {
        clientAppUrl: '//www.myapp.com/application.js',
        startClientAppAsync: true
    }
});
```


#### serverConfig
`serverConfig` is a hash of key/values that will **ONLY** be available to your ServerApp via the start method. In the ServerApp, `serverConfig` will be available as `options.serverConfig`:

```js
var ServerApp = Brisket.ServerApp.extend({

    start: function(options) {
        var environmentConfig = options.environmentConfig;
    }

});

var brisketServer = Brisket.createServer({
    apiHost: 'http://localhost:4000',
    clientAppRequirePath: 'app/ClientApp',

    ServerApp: ServerApp,
    serverConfig: { some: 'data' }
});

var ClientApp = Brisket.ClientApp.extend({

    start: function(options) {
        console.log(options.serverConfig); // undefined
    }

});
```

`serverConfig` is a good place to put any values that your end-users should not see but are necessary to run the server.
