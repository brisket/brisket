Child Views
===========

Brisket provides a child view managment system that helps you manage memory, and display child views. You could manually append the contents of a child view to your parent view's `el`, but you could end up with a lot of bookkeeping to manage. Brisket's child view system makes things easier.

## Documentation Index

* [Creating Child Views](#creating-child-views)
* [Placing Child Views](#placing-child-views)
* [Closing Child Views](#closing-child-views)
* [Replacing Child Views](#replacing-child-views)
* [Where Can I Create A Child View?](#where-can-i-create-a-child-view)
* [FAQ](#faq)

## Creating Child Views
Creating a child view creates a relationship between parent and child views.

### Creating with a View constructor

```js
var ChildView = Brisket.View.extend();

var ParentView = Brisket.View.extend({

    beforeRender: function() {
        this.createChildView(ChildView);
    }

});
```

Now there is a relationship between ParentView and a *future* instance of a ChildView. An instance of ChildView will NOT be created until it's needed.

### Creating with options
To pass options to the future ChildView instance, use `withOptions`:

```js
var ChildView = Brisket.View.extend({
    initialize: function(options) {
        console.log(options.some); // "data"
    }
});

var ParentView = Brisket.View.extend({

    beforeRender: function() {
        this.createChildView(ChildView)
            .withOptions({
                some: "data"
            });
    }

});
```

Now when Brisket internally creates an instance of ChildView, it will pass { some: "data" }.

### Creating with an instance of a View
Sometimes you may already have an instance of a view that you want to become a child of your parent view. You can pass an instance of a view to `createChildView`:

```js
var ChildView = Brisket.View.extend();
var childView = new ChildView();

var ParentView = Brisket.View.extend({

    childView: null,

    initialize: function(options) {
        this.childView = options.childView;
    },

    beforeRender: function() {
        this.createChildView(this.childView);
    }

});

var parentView = new ParentView({ childView: childView });
```

In this example, we're passing an instance of ChildView for the parent view to use. Once we pass it to `createChildView`, the parentView manages it.

**Note:** You cannot use `withOptions` when you call `createChildView` with an instance.

### Creating with an identifier
When you want to use more advanced techniques (e.g. replacing a parent-child view relationship, or closing a specific view), you will need to create your child view with an identifier.

```js
var ChildView = Brisket.View.extend();

var ParentView = Brisket.View.extend({

    beforeRender: function() {
        this.createChildView('child-view-id', ChildView);
    }

});
```

You can pass a string as an identifier as the first parameter to `createChildView` whether you pass a View constructor OR an instance of a View.

**Note:** Brisket will not allow you to create two child views with the same identifier. It also will not allow you to create a number-like identifier (e.g. '100', '6', '8008').

## Placing Child Views
So far we've only created relationships between parent and child views but we have not displayed them anywhere. After creating child views, you have to place them so that they appear in the page. Brisket comes with several placement strategies.

All placement strategies place a child view within the parent view i.e. within the parent view's `el`. In other words, a parent view only places child views (visually) within itself. All of the placement strategies except `andAppendIt` and `andPrependIt` take a destination. The destination can be either a selector, jquery object, or reference to HTMLElement.

### andAppendIt
Renders the child view at the end of the parent view.

```js
var ChildView = Brisket.View.extend({
    className: 'child',
    template: 'child view'
});

var ParentView = Brisket.View.extend({
    template: 'parent view',

    onClose: function() {
        this.closeChildViews();
    },

    beforeRender: function() {
        this.createChildView(ChildView)
            .andAppendIt();
    }

});


var parentView = new ParentView();
console.log(parentView.render().el.innerHTML);
// <div>parent view<div class='child'>child view</div></div>
```

### andAppendItTo
Renders the child view at the end of the passed in destination.

```js
var ChildView = Brisket.View.extend({
    className: 'child',
    template: 'child view'
});

var ParentView = Brisket.View.extend({
    template: 'parent view <div class="destination">destination</div>',

    onClose: function() {
        this.closeChildViews();
    },

    beforeRender: function() {
        this.createChildView(ChildView)
            .andAppendItTo('.destination');
    }

});


var parentView = new ParentView();
console.log(parentView.render().el.innerHTML);
// <div>parent view <div class='destination'>destination<div class='child'>child view</div></div></div>
```

### andPrependIt
Renders the child view at the beginning of the parent view.

```js
var ChildView = Brisket.View.extend({
    className: 'child',
    template: 'child view'
});

var ParentView = Brisket.View.extend({
    template: 'parent view',

    onClose: function() {
        this.closeChildViews();
    },

    beforeRender: function() {
        this.createChildView(ChildView)
            .andPrependIt();
    }

});


var parentView = new ParentView();
console.log(parentView.render().el.innerHTML);
// <div><div class='child'>child view</div>parent view</div>
```

### andPrependItTo
Renders the child view at the beginning of the passed in destination.

```js
var ChildView = Brisket.View.extend({
    className: 'child',
    template: 'child view'
});

var ParentView = Brisket.View.extend({
    template: 'parent view <div class="destination">destination</div>',

    onClose: function() {
        this.closeChildViews();
    },

    beforeRender: function() {
        this.createChildView(ChildView)
            .andPrependItTo('.destination');
    }

});


var parentView = new ParentView();
console.log(parentView.render().el.innerHTML);
// <div>parent view <div class='destination'><div class='child'>child view</div>destination</div></div>
```

### andInsertInto
Replaces the contents of the destination with the child view. It maintains the destination element though.

```js
var ChildView = Brisket.View.extend({
    className: 'child',
    template: 'child view'
});

var ParentView = Brisket.View.extend({
    template: 'parent view <div class="destination">destination</div>',

    onClose: function() {
        this.closeChildViews();
    },

    beforeRender: function() {
        this.createChildView(ChildView)
            .andInsertInto('.destination');
    }

});


var parentView = new ParentView();
console.log(parentView.render().el.innerHTML);
// <div>parent view <div class='destination'><div class='child'>child view</div></div></div>
```

### andInsertBefore
Renders the child view right before the destination.

```js
var ChildView = Brisket.View.extend({
    className: 'child',
    template: 'child view'
});

var ParentView = Brisket.View.extend({
    template: 'parent view <div class="destination">destination</div>',

    onClose: function() {
        this.closeChildViews();
    },

    beforeRender: function() {
        this.createChildView(ChildView)
            .andInsertBefore('.destination');
    }

});


var parentView = new ParentView();
console.log(parentView.render().el.innerHTML);
// <div>parent view <div class='child'>child view</div><div class='destination'>destination</div></div>
```

### andInsertAfter
Renders the child view right after the destination.

```js
var ChildView = Brisket.View.extend({
    className: 'child',
    template: 'child view'
});

var ParentView = Brisket.View.extend({
    template: 'parent view <div class="destination">destination</div> after destination',

    onClose: function() {
        this.closeChildViews();
    },

    beforeRender: function() {
        this.createChildView(ChildView)
            .andInsertAfter('.destination');
    }

});


var parentView = new ParentView();
console.log(parentView.render().el.innerHTML);
// <div>parent view <div class='destination'>destination</div><div class='child'>child view</div> after destination</div>
```

### andReplace
Replaces the destination completely with the child view. The entire destination element is blown away and replaced.

```js
var ChildView = Brisket.View.extend({
    className: 'child',
    template: 'child view'
});

var ParentView = Brisket.View.extend({
    template: 'parent view <div class="destination">destination</div>',

    onClose: function() {
        this.closeChildViews();
    },

    beforeRender: function() {
        this.createChildView(ChildView)
            .andReplace('.destination');
    }

});


var parentView = new ParentView();
console.log(parentView.render().el.innerHTML);
// <div>parent view <div class='child'>child view</div></div>
```

## Closing Child Views

### Closing all child views
To close all created child views, call `closeChildViews` on the parent view:

```js
var ChildView = Brisket.View.extend();

var ParentView = Brisket.View.extend({

    onClose: function() {
        this.closeChildViews();
    },

    beforeRender: function() {
        this.createChildView(ChildView)
            .andAppendIt();
    }

});

```

**Important - Always call `closeChildViews` in the parent view's `onClose` method.** If your parent view creates child views, Brisket will require that you implement an `onClose` method but it's up to you to make sure you call `closeChildViews` to clean up all child views.

### Closing one child view
Use `closeChildView` on the parent view to close a child view by identifier:

```js
var ChildView = Brisket.View.extend();

var ParentView = Brisket.View.extend({

    onClose: function() {
        this.closeChildView('child-view-id');
    },

    beforeRender: function() {
        this.createChildView('child-view-id', ChildView)
            .andAppendIt();
    }

});

```

**Note:** Unless you create a child view with an identifier, you won't be able to target it with `closeChildView`. You will need to use `closeChildViews` to ensure it is closed.

## Replacing Child Views
To replace a parent-child view relationship, use `replaceChildView`.

```js
var ChildView = Brisket.View.extend({
    className: 'child',
    template: 'child view'
});

var OtherChildView = Brisket.View.extend({
    className: 'other-child',
    template: 'other child view'
});

var ParentView = Brisket.View.extend({

    template: 'parent view',

    onClose: function() {
        this.closeChildViews();
    },

    beforeRender: function() {
        this.createChildView('child-view-id', ChildView)
            .andAppendIt();
    },

    afterRender: function() {
        this.replaceChildView('child-view-id', OtherChidView)
            .andPrependIt();
    }

});

var parentView = new ParentView();
console.log(parentView.render().el.innerHTML);
// <div><div class='other-child'>other child view</div>parent view</div>
```

In this example, `beforeRender` creates a child view with identifier 'child-view-id'. `afterRender` executes later and replaces the original child view relationship. So what is ultimately rendered is an instance of OtherChildView.

**Note:** Even though the ChildView was appended, OtherChildView was prepended. `replaceChildView` only replaces the view relationship between parent and child. It does **not** replace the child view visually in the parent's `el`.


## Where Can I Create A Child View?
Anywhere. You can create a child view at any time e.g. in the `beforeRender`, `afterRender` or even the `initialize` methods. If the parent view has not been rendered, Brisket will record any attempts to create a child view. When the parent view is rendered, all unrendered child views will be rendered correctly.

It is recommended to create most child views in the parent view's `beforeRender` callback.


## FAQ

**How do I get a reference to a view created by `createChildView`?**

If you really need to access the view created by `createChildView`, you can use the object returned by `createChildView`.

```js
var childView = this.createChildView(ChildView);
var instance = childView.view;
```

**This is strongly discouraged.** Since Brisket only creates the instance of the view when it needs to. The reference to .view is unreliable - it may or may not exist when you want to use it. Instead it is safer to instantiate your child view before passing it to `createChildView`. This way, you can maintain a direct reference to the view.

**In a child view, how do I access the parent view?**

You can't. Brisket's approach is only a parent view is aware of it's relationship with a child.

**Can I create child views that are NOT instances of Brisket.View?**

Yes. You can create a child view with any instance of Backbone.View, however, Brisket is only designed to clean up Brisket.Views. Internally, when Brisket closes a View, it calls the view's `close` method if it is available. If you want Brisket to clean up your non-Brisket child views automatically, implement a `close` method. Otherwise you will have to do custom cleanup in the parent view's `onClose` method.
