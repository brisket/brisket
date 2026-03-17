import ClientAjax from '../client/ClientAjax.js';
import ClientRenderingWorkflow from '../client/ClientRenderingWorkflow.js';
import ViewsFromServer from '../viewing/ViewsFromServer.js';
import Response from '../controlling/Response.js';
import version from '../../version.json' with { type: 'json' };

const ClientInitializer = {

  forApp: function initializeAppOnClient(options) {
    const environmentConfig = options.environmentConfig || {};
    const bootstrappedData = options.bootstrappedData || {};
    const appRoot = environmentConfig.appRoot;

    ClientAjax.setup(bootstrappedData, appRoot);

    ClientRenderingWorkflow.setEnvironmentConfig(environmentConfig);
    Response.setAppRoot(appRoot);

    ViewsFromServer.initialize();

    window.BrisketConfig = window.BrisketConfig || {};
    window.BrisketConfig.version = version.version;
  }

};

export default ClientInitializer;

