import SetupLinksAndPushState from './client/SetupLinksAndPushState.js';
import { onlyRunsOnClient } from './environment/Environment.js';
import Server from './server/Server.js';
import App from './application/App.js';
import Router from './controlling/Router.js';
import View from './viewing/View.js';
import Layout from './viewing/Layout.js';
import Events from './events/Events.js';
import TemplateAdapter from './templating/TemplateAdapter.js';
import StringTemplateAdapter from './templating/StringTemplateAdapter.js';
import Backbone from './application/Backbone.js';
import $ from './application/jquery.js';
import Errors from './errors/Errors.js';
import version from '../version.json' with { type: 'json' };

const brisketVersion = version.version;

const Brisket = {

  createServer: Server.create,

  App,

  Router,

  View,

  Layout,

  Events,

  Templating: {
    TemplateAdapter,
    StringTemplateAdapter,
  },

  Backbone,

  $,

  version: brisketVersion,

  onError: Errors.onError,

  navigateTo: onlyRunsOnClient(SetupLinksAndPushState.navigateTo),

  reloadRoute: onlyRunsOnClient(SetupLinksAndPushState.reloadRoute),

  replacePath: onlyRunsOnClient(SetupLinksAndPushState.replacePath),

  changePath: onlyRunsOnClient(SetupLinksAndPushState.changePath),

};

const onError = Brisket.onError;

export { Backbone, $, brisketVersion as version, App, onError };

export default Brisket;

