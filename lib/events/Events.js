import { isClient } from '../environment/Environment.js';
import Backbone from '../application/Backbone.js';
import noop from '../util/noop.js';

const Events = isClient() ? Backbone.Events : {
  on: noop,
  off: noop,
  bind: noop,
  unbind: noop,
  trigger: noop,
  once: noop,
  listenTo: noop,
  stopListening: noop,
  listenToOnce: noop
};

export default Events;

