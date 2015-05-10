Bundling With Browserify
========================

While Brisket does not force you to use any particular bundling library, you will be responsible for bundling your application for browser consumption. [Browserify](http://browserify.org/) is one popular solution for bundling your javascript code. It is important to make sure you do not bundle your application's server code into the bundle for the browser.

Suppose you had all of your server code in a single directory, e.g.

```
├── app
|   ├── server
|   |   ├── ServerApp.js
|   ├── client
|       ├── ClientApp.js
|
├── server.js
```

Based on [Browserify's documentation](https://github.com/substack/node-browserify#usage), you would ignore all of your server-side code as follows:

```bash
browserify app/**/*.js --ignore app/server/**/*.js
```
