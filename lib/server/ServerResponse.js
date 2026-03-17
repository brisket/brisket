import Response from '../controlling/Response.js';

const DEFAULT_REDIRECT_STATUS = 302;

const ServerResponse = Response.extend({

  statusCode: 200,
  redirectDestination: null,
  headers: null,
  success: true,

  initialize() {
    this.headers = {};
  },

  status(statusCode) {
    this.statusCode = statusCode;
  },

  set(field, value) {
    if (!field) {
      return;
    }

    if (typeof field === 'string') {
      this.headers[field] = value;
      return;
    }

    addAllFields(field, this.headers);
  },

  redirect(statusCode, destination) {
    if (arguments.length === 1) {
      destination = statusCode;
      statusCode = DEFAULT_REDIRECT_STATUS;
    }

    this.redirectDestination = Response.redirectDestinationFrom(destination);
    this.status(statusCode);

    throw Response.INTERRUPT_RENDERING;
  },

  shouldRedirect() {
    return !!this.redirectDestination;
  },

  fail() {
    this.success = false;
  },

  isSuccess() {
    return this.success;
  }

}, {
  create() {
    return new ServerResponse();
  }
});

function addAllFields(passedHeaders, headers) {
  const fields = Object.keys(passedHeaders);
  let currentField;

  for (let i = 0, len = fields.length; i < len; i++) {
    currentField = fields[i];

    headers[currentField] = passedHeaders[currentField];
  }
}

export default ServerResponse;

