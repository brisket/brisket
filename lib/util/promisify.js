function promisifyMaker(Promise) {
  return function promisify(method) {
    return function() {
      const args = new Array(arguments.length);
      const context = this || null;

      for (let i = arguments.length - 1; i > -1; i--) {
        args[i] = arguments[i];
      }

      return Promise.resolve()
        .then(function() {
          return method.apply(context, args);
        });
    };
  };
}

export default promisifyMaker;
