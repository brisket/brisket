Navigating with Brisket
=======================

Brisket provides methods to navigate the app in the browser.

### Brisket.navigateTo
Use `navigateTo` to navigate to a new route.

```js
// when in route "A"
Brisket.navigateTo("B");

// application routes to route "B"
```

### Brisket.reload
Use `reload` to re-run the current route. **Note:** In browsers that don't support pushState, `reload` will cause the browser to refresh the page.

```js
// when in route "A"
Brisket.reload();

// application re-runs route A
```

### Brisket.replacePath
Use `replacePath` to change location bar and replace pushState history entry.

```js
// when in route "A"
Brisket.replacePath("B");

// application stays on route "A" but current history is route "B"
```

### Brisket.changePath
Use `changePath` to change location bar and add an entry to pushState history.

```js
// when in route "A"
Brisket.changePath("B");

// application stays on route "A" but adds a new history entry - route "B"
```
