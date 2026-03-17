import { Backbone } from '../../../../lib/brisket.js';

const Side = Backbone.Model.extend({

  idAttribute: 'type',

  urlRoot: '/api/side'

});

export default Side;
