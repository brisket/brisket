import Backbone from '../application/Backbone.js';
import noop from '../util/noop.js';
import isApplicationLink from '../controlling/isApplicationLink.js';

const DEFAULT_REDIRECT_APP_ROOT = '';

function Response() {
  return this.initialize.apply(this, arguments);
}

Response.prototype = {

  initialize: noop,

  status: noop,

  set: noop,

  redirect: noop

};

Response.INTERRUPT_RENDERING = {};
Response.DEFAULT_REDIRECT_APP_ROOT = '/';
Response.appRootForRedirect = DEFAULT_REDIRECT_APP_ROOT;

Response.setAppRoot = function(appRoot) {
  Response.appRootForRedirect = appRoot ? appRoot : DEFAULT_REDIRECT_APP_ROOT;
};

Response.redirectDestinationFrom = function(destination) {
  if (isApplicationLink(destination)) {
    return `${Response.appRootForRedirect}/${destination}`;
  }

  return destination;
};

Response.extend = Backbone.Model.extend;

export default Response;

