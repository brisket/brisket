import Backbone from 'backbone';

const BrisketBackbone = Backbone.noConflict();

import $ from '../application/jquery.js';
import { clientDebuggingEnabled, isServer } from '../environment/Environment.js';
import serverWindow from '../server/serverWindow.js';

if (clientDebuggingEnabled() && window.__backboneAgent) {
  window.__backboneAgent.handleBackbone(BrisketBackbone);
}

if (isServer()) {
  BrisketBackbone.View.prototype._createElement = function(tagName) {
    return serverWindow.document.createElement(tagName);
  };
}

BrisketBackbone.$ = $;

export default BrisketBackbone;

