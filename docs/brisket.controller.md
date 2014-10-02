Brisket.Controller
================

Brisket provides a Controller object that provides semantics only. There is no functionality provided by the Brisket.Controller but you can use it to move logic off of a Brisket Router.

## A Use Case For a Controller
We have a route that displays an article:

```js
var ArticleRouter = RouterBrewery.create({

    routes: {
        'article/:id': 'article'
    },

    article: function(id) {
        return new ArticleView();
    }

});
```

We now want to add an article preview route without duplicating the logic in the article handler. The following will NOT work:


```js
var ArticleRouter = RouterBrewery.create({

    routes: {
        'article/:id': 'article',
        'preview/article/:id': 'previewArticle'
    },

    article: function(id, preview) {
        return new ArticleView({ preview: preview });
    },

    previewArticle: function(id) {
        return this.article(id, preview);
    }

});
```

It will not work because Brisket Router route handlers are actually modified by Brisket on creation. Use a Controller to move this logic off of the Router:

```js
var ArticleController = Brisket.Controller.extend({

    article: function(id, preview) {
        return new ArticleView({ preview: preview });
    },

    previewArticle: function(id) {
        return this.article(id, preview);
    }

});

var ArticleRouter = RouterBrewery.create({

    routes: {
        'article/:id': 'article',
        'preview/article/:id': 'previewArticle'
    },

    article: function(id) {
        return new ArticleController().article(id);
    },

    previewArticle: function(id) {
        return new ArticleController().previewArticle(id);
    }

});
```

If you do NOT have this use case, you can happily use Routers alone without any problems.
