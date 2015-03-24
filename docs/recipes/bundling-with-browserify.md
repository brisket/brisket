Bundling With Browserify
========================

While Brisket does not force you to use any particular bundling library, you will be responsible for bundling your application for browser consumption. [Browserify](http://browserify.org/) is one popular solution for bundling your javascript code into one file.

For now, you will have to shim jQuery Mockjax since it is not CommonJS compliant.

The following was tested using: [grunt-browserify@3.5.1](https://github.com/jmreidy/grunt-browserify/tree/v3.5.1) and [browserify-shim@3.8.2](https://github.com/thlorenz/browserify-shim/tree/v3.8.2):

## Gruntfile.js

```js
browserify: {
    options: {
        transform: ["browserify-shim"]
    }
}
```

## package.json

```json
"browserify-shim": {
  "./node_modules/brisket/node_modules/jquery-mockjax/jquery.mockjax.js": {
    "exports": "jquery-mockjax",
    "depends": [
      "jquery:jQuery"
    ]
  }
}
```
