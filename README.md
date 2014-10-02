Brisket
=====

## About Brisket
Brisket is a framework for building single page web apps using isomorphic JavaScript. A Brisket app is both a traditional web site AND a single page web application at the same time. Brisket provides the tools that you need to spend your time focusing on your application's logic rather than on "what environment is my code running in?".

## Documentation

### Brisket's Parts
* [**Brisket.RouterBrewery**](docs/brisket.routerbrewery.md): Brews routers that know how to route on the server and the client. Allows you to make your own RouterBrewery.
* [**Brisket.Routers**](docs/brisket.routers.md): A helper object to help you initialize Backbone Routers.
* [**Brisket.Controller**](docs/brisket.controller.md): A helper object to move functionality off of the router (it doesn't provide any functionality; just semantics).
* [**Brisket.Model**](docs/brisket.model.md): Our version of a Backbone.Model that knows how to sync on the server and the client.
* [**Brisket.Collection**](docs/brisket.collection.md): Our version of a Backbone.Collection that knows how to sync on the server and the client.
* [**Brisket.View**](docs/brisket.view.md): Our version of a Backbone.View that allows support for some of the core features - reattaching views, child view management, memory management, etc.
* [**Brisket.ErrorViewMapping**](docs/brisket.errorviewmapping.md): Creates errorViewMappings for your routers (e.g. 404 should show Page Not Found).
* [**Brisket.Layout**](docs/brisket.layout.md): A specialized View that handles meta tags, page title, etc.
* Brisket.Layout.Metatags: Use this class to make metatags for "pages".
* [**Brisket.Templating.TemplateAdapter**](docs/brisket.templating.templateadapter.md): Inherit from this to tell Brisket how to render templates.
* [**Brisket.Templating.StringTemplateAdapter**](docs/brisket.templating.stringtemplateadapter.md): The default template adapter. Set a View's template key to be a string template to get started.
* [**Brisket.Templating.compiledHoganTemplateAdapter**](docs/brisket.templating.compiledhogantemplateadapter.md): An alternate template adapter that lets your Views use templates from a compiled templates hash.
* [**Brisket.ServerApp**](docs/brisket.serverapp.md): An application that will do the necessary wiring on the server. Inherit to add your own functionality.
* [**Brisket.ClientApp**](docs/brisket.clientapp.md): An application that will do the necessary wiring on the client. Inherit to add your own functionality.
* [**Brisket.createServer**](docs/brisket.createserver.md): A function that returns an express engine that you can use in your application to run the server.


### Brisket Concepts And High Level Systems
* [**Brisket Router vs Backbone.Router**](docs/brisket.router.md): What makes a Brisket Router different from a regular Backbone.Router.
* [**Application Links**](docs/brisket.applicationlinks.md): How to link from one route to another in a Brisket app.
* [**Child Views**](docs/brisket.childviews.md): Brisket provides a system to help you manage a View's child views.

## Using Brisket in your project
To use Brisket you must install the npm module into your project. Since Brisket is not yet distributed in any public NPM repositories, you'll need to add it to your `package.json`. Use a hash at the end of the Git url to specify the version you want to use:

```packagejson
{
    'name': 'your project',
    'dependencies': {
        'brisket': 'git+https://github.com/bloomberg/brisket.git#v0.20.5',
    }
}
```

While Brisket does not force you to use any particular bundling library, you will be responsible for bundling your application for browser consumption. For now, you will have to ignore Brisket's server components and shim jQuery Mockjax since it is not CommonJS compliant. Here is an example config using [grunt-browserify@1.3.2](https://github.com/jmreidy/grunt-browserify/tree/v1.3.2):

```gruntfile
browserify: {
    options: {
        alias: [
            'node_modules/brisket/node_modules/jquery/dist/jquery.js:jquery'
        ],
        ignore: [
            'node_modules/brisket/lib/server/*'
        ],
        shim: {
            'jquery-mockjax': {
                path: 'node_modules/brisket/vendor/javascripts/jquery.mockjax.js',
                exports: null,
                depends: { jquery: 'jQuery' }
            }
        }
    }

}
```

Note that jQuery is aliased in this case because it is a dependency of jQuery Mockjax.

## Compatibility and Requirements

Brisket currently works with the following libraries:

* jQuery ^1.11.1
* jsdom ^1.11.1
* Underscore ~1.6.0
* Backbone ~1.1.2
* bluebird ~2.1.3
* jquery-mockjax ~1.5.3
* express ~4.0.0

### Browser Support
Chrome, Firefox, Safari, iOS 6+, Android 4+, Internet Explorer 9+

For support in older versions of IE you can include your favorite shim libraries in the head of your layout. For example to support IE8 include the following in your head tag:

```headtag
<!--[if lt IE 9]>
    <script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/es5-shim/2.3.0/es5-shim.min.js'></script>
    <script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/es5-shim/2.3.0/es5-sham.min.js'></script>
<![endif]-->
```

To support IE7, include the snippet above AND the following:

```headtag
<!--[if lt IE 8]>
    <script type='text/javascript' src='http://cdnjs.cloudflare.com/ajax/libs/json3/3.3.1/json3.min.js'></script>
<![endif]-->
```

**Note:** In IEs < 10, the single page app functionality that Brisket provides will not work since pushState is not available. Brisket does not support hash tag SPA's (TODO: link this to a page describing why not). When the SPA functionality is disabled, Brisket will operate like a standard website i.e. clicking application links will cause a page reload.

## Development

Make sure you have `grunt-cli` installed globally. To install:

```shell
$ npm install -g grunt-cli
```

Install dependencies:
```shell
$ npm install
```

To run the test suite:

```shell
$ grunt
```

## License
Apache License (Version 2). See license text in [LICENSE](LICENSE).

## Copyrights and Names
Brisket is copyrighted by [Bloomberg Finance LP](http://bloomberg.com). Brisket is a service mark of [Bloomberg LP](http://bloomberg.com).
