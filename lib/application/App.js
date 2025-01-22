import { onlyRunsOnClient, isServer, isClient } from '../environment/Environment.js';
import SetupLinksAndPushState from '../client/SetupLinksAndPushState.js';
import ClientInitializer from '../client/ClientInitializer.js';
import Browser from '../client/Browser.js';

const serverInitializers = [];
const clientInitializers = [];
let alreadyInitialized = false;
let started = false;
let initializeOptions;
let routersConfig;

const App = {

  useRouters(appRoutersConfig) {
    routersConfig = appRoutersConfig;
  },

  initialize(options) {
    if (alreadyInitialized) {
      return;
    }

    initializeOptions = options;

    if (isServer()) {
      run(serverInitializers);
    }

    if (isClient()) {
      run(clientInitializers);
    }

    initializeRouters(routersConfig);

    alreadyInitialized = true;
  },

  addInitializer: addTo(serverInitializers, clientInitializers),

  addServerInitializer: addTo(serverInitializers),

  addClientInitializer: addTo(clientInitializers),

  prependInitializer: prependTo(serverInitializers, clientInitializers),

  start: onlyRunsOnClient(function() {
    if (started) {
      return;
    }

    started = true;

    const BrisketConfig = window.BrisketConfig = window.BrisketConfig || {};

    if (BrisketConfig.startConfig) {
      startClient(BrisketConfig.startConfig);
      BrisketConfig.started = true;
      return;
    }

    Object.defineProperty(BrisketConfig, 'startConfig', {
      set(startConfig) {
        startClient(startConfig);
      }
    });
  }),

  reset() {
    serverInitializers.length = 0;
    clientInitializers.length = 0;
    alreadyInitialized = false;
    initializeOptions = undefined;
    routersConfig = undefined;
    started = false;
  }

};

function startClient(startConfig) {
  App.prependInitializer(function(startConfig) {
    ClientInitializer.forApp(startConfig);
  });

  App.initialize(startConfig);

  // Wayne Warner 12/28/2014 start Backbone history last to ensure
  //  all routers and environment variables have been set up before
  //  any routes execute
  SetupLinksAndPushState.start({
    root: startConfig.environmentConfig.appRoot || '',
    browserSupportsPushState: Browser.hasPushState()
  });
}

function initializeRouters(routersConfig) {
  if (!routersConfig) {
    return;
  }

  const CatchAllRouter = routersConfig.CatchAllRouter;
  const routers = routersConfig.routers;

  if (CatchAllRouter) {
    new CatchAllRouter();
  }

  for (let i = 0, len = routers.length; i < len; i++) {
    new routers[i]();
  }
}

function run(initializers) {
  for (let i = 0, len = initializers.length; i < len; i++) {
    initializers[i](initializeOptions);
  }
}

function verify(initializer) {
  if (typeof initializer === 'function') {
    return;
  }

  throw new Error('App initializers must be a function');
}

function addTo() {
  return to.call(null, 'push', arguments[0], arguments[1]);
}

function prependTo() {
  return to.call(null, 'push', arguments[0], arguments[1]);
}

function to(how) {
  const initializerGroups = [arguments[1], arguments[2]];

  return function(initializer) {
    verify(initializer);

    if (alreadyInitialized) {
      initializer(initializeOptions);
      return;
    }

    for (let i = 0, len = initializerGroups.length; i < len; i++) {
      if (!initializerGroups[i]) {
        continue;
      }

      initializerGroups[i][how](initializer);
    }
  };
}

export default App;

