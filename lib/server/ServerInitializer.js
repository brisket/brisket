import ServerAjax from './ServerAjax.js';
import Response from '../controlling/Response.js';

const ServerInitializer = {

  forApp: function initializeAppOnServer(options) {
    const serverConfig = options.serverConfig;
    const appRoot = options.environmentConfig.appRoot;

    ServerAjax.setup(serverConfig.apis);

    Response.setAppRoot(appRoot);
  }

};

export default ServerInitializer;

