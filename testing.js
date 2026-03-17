import Layout from './lib/viewing/Layout.js';
import View from './lib/viewing/View.js';
import Backbone from './lib/application/Backbone.js';
import Events from './lib/events/Events.js';
import noop from './lib/util/noop.js';
import _ from 'underscore';

const originalEvents = _.clone(Events);

const BrisketTesting = {

  setup() {
    Layout.prototype.reattach = noop;
  },

  enableEvents() {
    View.prototype.delegateEvents = Backbone.View.prototype.delegateEvents;
    View.prototype.undelegateEvents = Backbone.View.prototype.undelegateEvents;

    _.extend(View.prototype, Backbone.Events);
    _.extend(Events, Backbone.Events);
  },

  disableEvents() {
    View.prototype.delegateEvents = function() {
      return this;
    };

    View.prototype.undelegateEvents = function() {
      return this;
    };

    _.extend(View.prototype, originalEvents);
    _.extend(Events, originalEvents);
  }

};

export default BrisketTesting;

