import Events from '../../lib/events/Events.js';
import noop from '../../lib/util/noop.js';

describe('Events', function() {

  it('noops on', function() {
    expect(Events.on).toBe(noop);
  });

  it('noops off', function() {
    expect(Events.off).toBe(noop);
  });

  it('noops trigger', function() {
    expect(Events.trigger).toBe(noop);
  });

  it('noops once', function() {
    expect(Events.once).toBe(noop);
  });

  it('noops listenTo', function() {
    expect(Events.listenTo).toBe(noop);
  });

  it('noops listenToOnce', function() {
    expect(Events.listenToOnce).toBe(noop);
  });

  it('noops stopListening', function() {
    expect(Events.stopListening).toBe(noop);
  });

});

