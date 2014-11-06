Brisket.onError
======================
You can register multiple error callbacks, and they will be called in the same order as they were registered.

## Creating Error Event Callbacks

```js
Brisket.onError(function(error) {
    console.log("Error: ", error);
});

Brisket.onError(function(error) {
    customLogger.log("Error: ", error);
});
```
