BrisketTesting
===============================

BrisketTesting provides tools to be able to test Brisket objects.

### BrisketTesting.setup()
Run `BrisketTesting.setup` before every test in your test suite.

```js
const BrisketTesting = require('brisket/testing');

beforeEach(function() {
  BrisketTesting.setup();
});
```

### BrisketTesting.enableEvents()
Brisket disables events when outside of a browser context. Use `BrisketTesting.enableEvents` to enable all events so that you can unit test the functionality.

```js
const BrisketTesting = require('brisket/testing');

beforeEach(function() {
  BrisketTesting.setup();
  BrisketTesting.enableEvents();
});
```

### BrisketTesting.disableEvents()
If you need to, use `BrisketTesting.disableEvents` to re-disable events after you've enabled them.

```js
const BrisketTesting = require('brisket/testing');

beforeEach(function() {
  BrisketTesting.setup();
  BrisketTesting.enableEvents();
});

it('works without events', function() {
  BrisketTesting.disableEvents();
  // ...
});
```
