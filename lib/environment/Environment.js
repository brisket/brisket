import noop from '../util/noop.js';

const runningOnServer = typeof window == 'undefined';

const isServer = () => runningOnServer;
const isClient = () => !isServer();
const clientDebuggingEnabled = () => !!(isClient() && window.BrisketConfig && window.BrisketConfig.debug === true);
const onlyRunsOnClient = (method) => isServer() ? noop : method;

export {
  isServer,
  isClient,
  clientDebuggingEnabled,
  onlyRunsOnClient
};

