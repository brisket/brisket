const handlers = [];

const ServerDispatcher = {

  addRoute(route, rawRoute, callback) {
    handlers.unshift({
      route,
      rawRoute,
      callback
    });
  },

  dispatch(fragment, expressRequest, environmentConfig) {
    const handlerForRoute = findHandlerForRoute(fragment);

    if (!handlerForRoute) {
      return null;
    }

    const handledRoute = {
      content: handlerForRoute.callback(
        fragment,
        expressRequest,
        environmentConfig
      ),
      handler: handlerForRoute
    };

    return handledRoute;
  },

  reset() {
    handlers.length = 0;
  }

};

function findHandlerForRoute(fragment) {
  let handler;

  for (let i = 0, len = handlers.length; i < len; i++) {
    handler = handlers[i];

    if (handler.route.test(fragment)) {
      return handler;
    }
  }
}

export default ServerDispatcher;

