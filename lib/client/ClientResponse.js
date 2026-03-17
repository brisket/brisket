import Response from '../controlling/Response.js';

const ClientResponse = Response.extend({

  windough: null,

  initialize(windough) {
    this.windough = windough;
  },

  redirect(destination) {
    if (arguments.length > 1) {
      destination = arguments[1];
    }

    this.windough.location.replace(Response.redirectDestinationFrom(destination));

    throw Response.INTERRUPT_RENDERING;
  }

}, {
  from(windough) {
    return new ClientResponse(windough);
  }
});

export default ClientResponse;

