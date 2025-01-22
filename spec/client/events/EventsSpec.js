import Events from '../../../lib/events/Events.js';
import Backbone from '../../../lib/application/Backbone.js';

describe('Events', function() {

  it('proxies on to Backbone.Events', function() {
    expect(Events.on).toBe(Backbone.Events.on);
  });

  it('proxies once to Backbone.Events', function() {
    expect(Events.once).toBe(Backbone.Events.once);
  });

  it('proxies trigger to Backbone.Events', function() {
    expect(Events.trigger).toBe(Backbone.Events.trigger);
  });

  it('proxies off to Backbone.Events', function() {
    expect(Events.off).toBe(Backbone.Events.off);
  });

  it('proxies stopListening to Backbone.Events', function() {
    expect(Events.stopListening).toBe(Backbone.Events.stopListening);
  });

  it('proxies listenTo to Backbone.Events', function() {
    expect(Events.listenTo).toBe(Backbone.Events.listenTo);
  });

  it('proxies listenToOnce to Backbone.Events', function() {
    expect(Events.listenToOnce).toBe(Backbone.Events.listenToOnce);
  });
});

