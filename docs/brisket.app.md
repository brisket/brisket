Brisket.App
===============

Initialize your application with Brisket.App.

## Documentation Index

* [Setting Up Routers](#setting-up-routers)
* [Initializing](#initialize-the-server)
* [Smaller Client Bundles](#smaller-client-bundles)

## Setting Up Routers
Similar to vanilla Backbone, initializing Routers will register them with Brisket. Make sure to initialize Routers before you start the application:

```js
import { App } from 'brisket';
import Handles404Router from './application/Handles404Router.js';
import FooRouter from './foo/FooRouter.js';
import BarRouter from './bar/BarRouter.js';
import BazRouter from './baz/BazRouter.js';

new Handles404Router();
new FooRouter();
new BarRouter();
new BazRouter();

App.start();
```

`useRouters` is a convenience method to help you initialize your routers. If one of your router has a catch all route matcher (e.g. *undefined), specify it as the CatchAllRouter to ensure that it is initialized first.

```js
import { App } from 'brisket';
import Handles404Router from './application/Handles404Router.js';
import FooRouter from './foo/FooRouter.js';
import BarRouter from './bar/BarRouter.js';
import BazRouter from './baz/BazRouter.js';

App.useRouters({

	CatchAllRouter: Handles404Router,

	routers: [
		FooRouter,
		BarRouter,
		BazRouter,
	],

});

App.start();
```

## Initializing
Use `addServerInitializer` in your express server setup to add an initializer that will only run on the server:

```js
/* initialize.js */

import { App } from 'brisket';
import Handles404Router from './application/Handles404Router.js';
import FooRouter from './foo/FooRouter.js';
import BarRouter from './bar/BarRouter.js';
import BazRouter from './baz/BazRouter.js';

// Add Routers
App.useRouters({

	CatchAllRouter: Handles404Router,

	routers: [
		FooRouter,
		BarRouter,
		BazRouter,
	],

});

// Initialize application
App.addInitializer(({ environmentConfig, serverConfig }) => {
    // serverConfig will be passed ONLY on the server
    doSomethingOnClientANDServer();
});

App.addInitializer(({ environmentConfig, serverConfig }) => {
    doSomethingElseOnClientANDServer();
});

// Initialize server
App.addServerInitializer(({ environmentConfig, serverConfig }) => {
    doSomethingOnServer();
});

App.addServerInitializer(({ environmentConfig, serverConfig }) => {
    doSomethingElseOnServer();
});

// Initialize client
App.addClientInitializer(({ environmentConfig }) => {
    doSomethingOnClient();
});

App.addClientInitializer(({ environmentConfig }) => {
    doSomethingElseOnClient();
});

// Start
App.start();
```

On the server side, be sure to require initialize.js before creating yur Brisket server:

```js
/* server.js */
import { createServer } from 'brisket';
import "./initialize.js";

const brisketServer = createServer({
	apis: {
		host: 'http://api.example.com',
	},

	environmentConfig: {
		data: 'data',
	},

	serverConfig: {
		data: 'serverData',
	},
});
```

For the client side, make sure initialize.js is in your client side bundle and runs before your Routers:

```js
browserify({
  entries: './initialize.js',
});
```

If you need to initialize modules that will throw an error on either the server OR client side just by importing them, you should break up initialize.js into multiple files - initializeClient.js and initializeServer.js:

```js
/* initialize.js */
import { App } from 'brisket';
import Handles404Router from './application/Handles404Router.js';
import FooRouter from './foo/FooRouter.js';
import BarRouter from './bar/BarRouter.js';
import BazRouter from './baz/BazRouter.js';

// Add Routers
App.useRouters({

	CatchAllRouter: Handles404Router,

	routers: [
		FooRouter,
		BarRouter,
		BazRouter,
	],

});

// Initialize application
App.addInitializer(({ environmentConfig, serverConfig }) => {
	// serverConfig will be passed ONLY on the server
	doSomethingOnClientANDServer();
});

App.addInitializer(({ environmentConfig, serverConfig }) => {
  doSomethingElseOnClientANDServer();
});
```

```js
/* initializeClient.js */
import { App } from 'brisket';
import './initialize.js';

App.addClientInitializer(({ environmentConfig }) => {
  doSomethingOnClient();
});

App.addClientInitializer(({ environmentConfig }) => {
  doSomethingElseOnClient();
});
```

```js
/* initializeServer.js */
import { App } from 'brisket';
import './initialize.js';

App.addServerInitializer(({ environmentConfig, serverConfig }) => {
  doSomethingOnServer();
});

App.addServerInitializer(({ environmentConfig, serverConfig }) => {
  doSomethingElseOnServer();
});
```

On the server, only import initializeServer.js. For the client, only import initializeClient.js

## Smaller Client Bundles
In the examples above, we use the same Routers on the client and the server, however, that isn't required. If you want to make a smaller client bundle for a given route, you can make a bundle that only includes the route. Then you can lazy load the other Routers if needed:

```js
/* initializeServer */

import { App } from 'brisket';
import Handles404Router from './application/Handles404Router.js';
import FooRouter from './foo/FooRouter.js';
import BarRouter from './bar/BarRouter.js';
import BazRouter from './baz/BazRouter.js';

// Add Routers
App.useRouters({

	CatchAllRouter: Handles404Router,

	routers: [
		FooRouter,
		BarRouter,
		BazRouter,
	],

});

App.start();
```

```js
/* initializeFoo */
import { App } from 'brisket';
import FooRouter from './foo/FooRouter.js';

new FooRouter();

App.start();

const s = document.createElement('script');
const h = document.head;

s.setAttribute('src', '/bundleInitializeOtherRoutes.js');

setTimeout(function(){
	h.insertBefore(s, null);
	h = null;
},300);
```

```js
/* initializeOtherRoutes */
import { App } from 'brisket';
import Handles404Router from './application/Handles404Router.js';
import BarRouter from './bar/BarRouter.js';
import BazRouter from './baz/BazRouter.js';

new Handles404Router();
new BarRouter();
new BazRouter();

App.start();
```
