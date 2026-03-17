import express from 'express';
import axios from 'axios';
import App from '../application/App.js';
import ServerDispatcher from '../server/ServerDispatcher.js';
import ServerResponseWorkflow from './ServerResponseWorkflow.js';
import DomainLocalStorage from './DomainLocalStorage.js';
import Cookies from '../cookies/Cookies.js';
import ForwardClientRequest from './ForwardClientRequest.js';
import ServerInitializer from './ServerInitializer.js';

const Server = {

  create(requestedConfig) {
    const brisketEngine = express();

    const config = requestedConfig || {};
    const apis = config.apis || {};
    const environmentConfig = config.environmentConfig || {};
    const serverConfig = config.serverConfig || {};
    const onRouteHandled = config.onRouteHandled;
    const appRoot = environmentConfig.appRoot;
    const debug = config.debug === true;

    verifyAppRoot(appRoot);
    verifyApis(apis);

    serverConfig.apis = apis;

    axios.defaults.adapter = 'http';

    App.prependInitializer(function(options) {
      ServerInitializer.forApp(options);
    });

    App.initialize({
      environmentConfig,
      serverConfig
    });

    if (debug) {
      environmentConfig.debug = true;
    }

    brisketEngine.use(DomainLocalStorage.middleware);

    Object.keys(apis).forEach(function(apiAlias) {
      const apiConfig = apis[apiAlias];
      brisketEngine.use(`/${apiAlias}`, ForwardClientRequest.toApi(apiConfig, apiAlias));
    });

    brisketEngine.get(
      /(.*)/,
      sendResponseFromApp(
        environmentConfig,
        onRouteHandled,
      )
    );

    return brisketEngine;
  },

  sendResponseFromApp

};

function sendResponseFromApp(environmentConfig, onRouteHandled) {
  return function(expressRequest, expressResponse, next) {
    const fragment = expressRequest.path.slice(1);

    Cookies.letClientKnowIfAvailable(environmentConfig, expressRequest);

    const handledRoute = ServerDispatcher.dispatch(
      fragment,
      expressRequest,
      environmentConfig
    );

    if (!handledRoute) {
      next();
      return;
    }

    if (typeof onRouteHandled === 'function') {
      onRouteHandled({
        request: expressRequest,
        route: handledRoute.handler.rawRoute
      });
    }

    ServerResponseWorkflow.sendResponseFor(
      handledRoute.content,
      expressResponse,
      next
    );
  };
}

function verifyAppRoot(appRoot) {
  if (appRoot && /\/$/.test(appRoot)) {
    throw new Error(
      'You must omit trailing slash when providing an appRoot'
    );
  }

  if (appRoot && !/^\//.test(appRoot)) {
    throw new Error(
      'You must include leading slash when providing an appRoot'
    );
  }
}

function verifyApis(apis) {
  Object.keys(apis).forEach(function(apiAlias) {
    const apiConfig = apis[apiAlias];

    if (!apiConfig || typeof apiConfig.host !== 'string') {
      throw new Error(`The host for ${apiAlias} in apis config must be a string.`);
    }
  });
}

export default Server;

