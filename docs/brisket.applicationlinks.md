Application Links
=================

In a Brisket app, an `application link` is an anchor tag link that links to another route in your app. Brisket treats anchor tags with relative path links as `application link`s.

Anchor tags with relative paths look like this:

```html
<a href="books">Link to 'Books' listing route</a>
<a href="books/turtles">Link to 'Turtles Book' route</a>
<a href="">Link to 'Home' route</a>
```

Clicking any of these fires a new route in your app. **Note:** while you are on a route, Brisket will ignore clicks to the same route. For example, while we're on the "books" route, if we click on a link to "books", Brisket will act as if nothing happened.

A nice feature of `application link`s is they "work" even if JavaScript is disabled. When JavaScript is disabled or has not loaded yet, clicking `application link`s triggers a full page load with the correct route - users can **always** access content!

Brisket allows all other types of links to behave as they would on a standard website:

```html
<a href="http://www.example.com">Fully qualified link</a>
<a href="//www.example.com">Protocol agnostic link</a>
<a href="#middle">Hash tag link</a>
<a href="mailto:email@example.com">Mailto link</a>
<a href="javascript:{}">Javascript Code Link</a>
<a href="/books">Absolute links</a>
```

**Note:** While absolute links (e.g. "/books") go to another route in your app, they trigger a full page load rather causing a pushState change.


