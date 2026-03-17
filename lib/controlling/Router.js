import _ from 'underscore';
import Backbone from '../application/Backbone.js';
import noop from '../util/noop.js';
import { isServer, isClient } from '../environment/Environment.js';
import ServerDispatcher from '../server/ServerDispatcher.js';
import ServerRenderingWorkflow from '../server/ServerRenderingWorkflow.js';
import ClientRenderingWorkflow from '../client/ClientRenderingWorkflow.js';

const Router = Backbone.Router.extend({

  layout: null,
  errorViewMapping: null,

  onClose: noop,

  close() {
    try {
      this.onClose();
    } catch (e) {
      console.error(
        'Error: There is an error in a Router\'s onClose callback.'
      );

      throw e;
    }
  },

  onRouteStart: noop.thatWillBeCalledWith( /* layout, request, response */ ),

  onRouteComplete: noop.thatWillBeCalledWith( /* layout, request, response */ ),

  renderError(statusCode) {
    return Promise.reject({
      status: statusCode
    });
  },

  route(route, name, callback) {
    const rawRoute = route;

    if (!_.isRegExp(route)) {
      route = this._routeToRegExp(route);
    }

    if (_.isFunction(name)) {
      callback = name;
      name = '';
    }

    if (!callback) {
      callback = this[name];
    }

    if (isServer()) {
      addRouteToServerDispatcher(this, route, rawRoute, callback);
    }

    if (isClient()) {
      addRouteToBackboneHistory(this, route, rawRoute, name, callback);
    }

    return this;
  }

});

function addRouteToServerDispatcher(router, route, rawRoute, callback) {
  ServerDispatcher.addRoute(route, rawRoute, function(fragment, expressRequest, environmentConfig) {
    const params = router._extractParameters(route, fragment);

    if (!callback) {
      return;
    }

    const responseForRoute = ServerRenderingWorkflow.execute(
      router,
      callback,
      params,
      expressRequest,
      environmentConfig
    );

    return responseForRoute;
  });
}

function addRouteToBackboneHistory(router, route, rawRoute, name, callback) {
  Backbone.history.route(route, function(fragment) {
    const params = router._extractParameters(route, fragment);

    if (!callback) {
      return;
    }

    ClientRenderingWorkflow.execute(router, callback, params);

    router.trigger.apply(router, [`route:${name}`].concat(params));
    router.trigger('route', name, params);
    Backbone.history.trigger('route', router, name, params);
  });
}

export default Router;

