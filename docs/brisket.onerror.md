Brisket.onError
======================
You can register multiple error callbacks, and they will be called in the same order as they were registered. Error callbacks will be called with error and [request object](brisket.requestobject.md) for the current request.

## Creating Error Event Callbacks

```js
Brisket.onError(function(error, request) {
    console.log("Error: ", error);
    console.log("request.referrer: ", request.referrer);
});

Brisket.onError(function(error, request) {
    customLogger.log("Error: ", error);
    customLogger.log("request.referrer: ", request.referrer);
});
```
