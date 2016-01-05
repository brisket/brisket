Child Views
===========

Brisket provides a child view management system that helps you manage memory, and display child views. You could manually append the contents of a child view to your parent view's `el`, but you could end up with a lot of bookkeeping to manage. Brisket's child view system makes things easier.

## Documentation Index

* [Creating Child Views](#creating-child-views)
* [Placing Child Views in View's template](#placing-child-views-in-views-template)
* [Placing Child Views in the Parent View](#placing-child-views-in-the-parent-view)
* [Closing Child Views](#closing-child-views)
* [Replacing Child Views](#replacing-child-views)
* [Where Can I Create A Child View?](#where-can-i-create-a-child-view)
* [FAQ](#faq)

## Creating Child Views
Creating a child view creates a relationship between parent and child views.

### Creating with a View constructor

```js
const ChildView = Brisket.View.extend();

const ParentView = Brisket.View.extend({

    beforeRender() {
        this.createChildView(ChildView);
    }

});
```

Now there is a relationship between ParentView and a *future* instance of a ChildView. An instance of ChildView will NOT be created until it's needed.

### Creating with options
To pass options to the future ChildView instance, use `withOptions`:

```js
const ChildView = Brisket.View.extend({
    initialize(options) {
        console.log(options.some); // "data"
    }
});

const ParentView = Brisket.View.extend({

    beforeRender() {
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
const ChildView = Brisket.View.extend();
const childView = new ChildView();

const ParentView = Brisket.View.extend({

    childView: null,

    initialize(options) {
        this.childView = options.childView;
    },

    beforeRender() {
        this.createChildView(this.childView);
    }

});

const parentView = new ParentView({ childView: childView });
```

In this example, we're passing an instance of ChildView for the parent view to use. Once we pass it to `createChildView`, the parentView manages it.

**Note:** You cannot use `withOptions` when you call `createChildView` with an instance.

### Creating with an identifier
When you want to use more advanced techniques (e.g. replacing a parent-child view relationship, or closing a specific view), you will need to create your child view with an identifier.

```js
const ChildView = Brisket.View.extend();

const ParentView = Brisket.View.extend({

    beforeRender() {
        this.createChildView('child-view-id', ChildView);
    }

});
```

You can pass a string as an identifier as the first parameter to `createChildView` whether you pass a View constructor OR an instance of a View.

**Note:** Brisket will not allow you to create two child views with the same identifier. It also will not allow you to create a number-like identifier (e.g. '100', '6', '8008').

## Placing Child Views in View's template
So far we've only created relationships between parent and child views but we have not displayed them anywhere. After creating child views, you have to place them so that they appear in the page. Whenever you create a child view, it will be available to be placed in your View's template:


```js
const ChildView = Brisket.View.extend();

const ParentView = Brisket.View.extend({

    template({ views }) {
        return `child1 should go here: ${views.child1} and
                child2 goes here: ${views.child2}`;
    },

    beforeRender() {
        this.createChildView('child1', ChildView);
        this.createChildView('child2', ChildView);
    }

});

const parentView = new ParentView();
console.log(parentView.render().el.innerHTML);
// child1 should go here <div data-view-uid="0_1_0"></div> and
// child2 goes here <div data-view-uid="0_1_1"></div>
```

**Note:** Only child views that are created before the view renders (i.e. in `beforeRender` or before that) will be available to place in the template.

## Placing Child Views in the Parent View
Brisket also comes with helpers to place a Child View from within the parent view i.e. within the parent view's `el`. A parent view can only place child views (visually) within itself.

### andAppendIt()
Renders the child view at the end of the parent view.

```js
const ChildView = Brisket.View.extend({
    className: 'child',
    template: 'child view'
});

const ParentView = Brisket.View.extend({
    template: 'parent view',

    beforeRender() {
        this.createChildView(ChildView)
            .andAppendIt();
    }

});


const parentView = new ParentView();
console.log(parentView.render().el.innerHTML);
// <div>parent view<div class='child'>child view</div></div>
```

### andAppendItTo(destination)
Renders the child view at the end of the passed in destination.

```js
const ChildView = Brisket.View.extend({
    className: 'child',
    template: 'child view'
});

const ParentView = Brisket.View.extend({
    template: 'parent view <div class="destination">destination</div>',

    beforeRender() {
        this.createChildView(ChildView)
            .andAppendItTo('.destination');
    }

});


const parentView = new ParentView();
console.log(parentView.render().el.innerHTML);
// <div>parent view <div class='destination'>destination<div class='child'>child view</div></div></div>
```

### andPrependIt()
Renders the child view at the beginning of the parent view.

```js
const ChildView = Brisket.View.extend({
    className: 'child',
    template: 'child view'
});

const ParentView = Brisket.View.extend({
    template: 'parent view',

    beforeRender() {
        this.createChildView(ChildView)
            .andPrependIt();
    }

});


const parentView = new ParentView();
console.log(parentView.render().el.innerHTML);
// <div><div class='child'>child view</div>parent view</div>
```

### andPrependItTo(destination)
Renders the child view at the beginning of the passed in destination.

```js
const ChildView = Brisket.View.extend({
    className: 'child',
    template: 'child view'
});

const ParentView = Brisket.View.extend({
    template: 'parent view <div class="destination">destination</div>',

    beforeRender() {
        this.createChildView(ChildView)
            .andPrependItTo('.destination');
    }

});


const parentView = new ParentView();
console.log(parentView.render().el.innerHTML);
// <div>parent view <div class='destination'><div class='child'>child view</div>destination</div></div>
```

### andInsertInto(destination)
Replaces the contents of the destination with the child view. It maintains the destination element though.

```js
const ChildView = Brisket.View.extend({
    className: 'child',
    template: 'child view'
});

const ParentView = Brisket.View.extend({
    template: 'parent view <div class="destination">destination</div>',

    beforeRender() {
        this.createChildView(ChildView)
            .andInsertInto('.destination');
    }

});


const parentView = new ParentView();
console.log(parentView.render().el.innerHTML);
// <div>parent view <div class='destination'><div class='child'>child view</div></div></div>
```

### andInsertBefore(destination)
Renders the child view right before the destination.

```js
const ChildView = Brisket.View.extend({
    className: 'child',
    template: 'child view'
});

const ParentView = Brisket.View.extend({
    template: 'parent view <div class="destination">destination</div>',

    beforeRender() {
        this.createChildView(ChildView)
            .andInsertBefore('.destination');
    }

});


const parentView = new ParentView();
console.log(parentView.render().el.innerHTML);
// <div>parent view <div class='child'>child view</div><div class='destination'>destination</div></div>
```

### andInsertAfter(destination)
Renders the child view right after the destination.

```js
const ChildView = Brisket.View.extend({
    className: 'child',
    template: 'child view'
});

const ParentView = Brisket.View.extend({
    template: 'parent view <div class="destination">destination</div> after destination',

    beforeRender() {
        this.createChildView(ChildView)
            .andInsertAfter('.destination');
    }

});


const parentView = new ParentView();
console.log(parentView.render().el.innerHTML);
// <div>parent view <div class='destination'>destination</div><div class='child'>child view</div> after destination</div>
```

### andReplace(destination)
Replaces the destination completely with the child view. The entire destination element is blown away and replaced.

```js
const ChildView = Brisket.View.extend({
    className: 'child',
    template: 'child view'
});

const ParentView = Brisket.View.extend({
    template: 'parent view <div class="destination">destination</div>',

    beforeRender() {
        this.createChildView(ChildView)
            .andReplace('.destination');
    }

});


const parentView = new ParentView();
console.log(parentView.render().el.innerHTML);
// <div>parent view <div class='child'>child view</div></div>
```

## Closing Child Views

### Closing all child views
Child views are automatically closed when a view is cleaned up. To manually close child views for a view, call view.closeChildViews().

```js
const ChildView = Brisket.View.extend();

const ParentView = Brisket.View.extend({

    removeAllChildViews() {
        this.closeChildViews();
    },

    beforeRender() {
        this.createChildView(ChildView)
            .andAppendIt();
    }

});

```

### Closing one child view
Use `closeChildView` on the parent view to close a child view by identifier:

```js
const ChildView = Brisket.View.extend();

const ParentView = Brisket.View.extend({

    removeAChildView() {
        this.closeChildView('child-view-id');
    },

    beforeRender() {
        this.createChildView('child-view-id', ChildView)
            .andAppendIt();
    }

});

```

**Note:** Unless you create a child view with an identifier, you won't be able to target it with `closeChildView`.

## Replacing Child Views
To replace a parent-child view relationship, use `replaceChildView`.

```js
const ChildView = Brisket.View.extend({
    className: 'child',
    template: 'child view'
});

const OtherChildView = Brisket.View.extend({
    className: 'other-child',
    template: 'other child view'
});

const ParentView = Brisket.View.extend({

    template: 'parent view',

    beforeRender() {
        this.createChildView('child-view-id', ChildView)
            .andAppendIt();
    },

    afterRender() {
        this.replaceChildView('child-view-id', OtherChidView)
            .andPrependIt();
    }

});

const parentView = new ParentView();
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
const childView = this.createChildView(ChildView);
const instance = childView.view;
```

**This is strongly discouraged.** Since Brisket only creates the instance of the view when it needs to. The reference to .view is unreliable - it may or may not exist when you want to use it. Instead it is safer to instantiate your child view before passing it to `createChildView`. This way, you can maintain a direct reference to the view.

**In a child view, how do I access the parent view?**

You can't. Brisket's approach is only a parent view is aware of it's relationship with a child.

**Can I create child views that are NOT instances of Brisket.View?**

Yes. You can create a child view with any instance of Backbone.View, however, Brisket is only designed to clean up Brisket.Views. Internally, when Brisket closes a View, it calls the view's `close` method if it is available. If you want Brisket to clean up your non-Brisket child views automatically, implement a `close` method. Otherwise you will have to do custom cleanup in the parent view's `onClose` method.
