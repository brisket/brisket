import Backbone from '../application/Backbone.js';

const events = Object.assign({}, Backbone.Events);
const ERROR_EVENT_NAME = 'error';

const Errors = {

  API_ERROR: 'ApiError',

  notify(error, request) {
    events.trigger(ERROR_EVENT_NAME, error, request);
  },

  onError(callback) {
    events.on(ERROR_EVENT_NAME, callback);
  }

};

export default Errors;

