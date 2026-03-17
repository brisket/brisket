import View from '../../../lib/viewing/View.js';
import Backbone from '../../../lib/application/Backbone.js';

describe('View', function() {
  let view;

  it('is an extension of Backbone.View', function() {
    expect(View.prototype instanceof Backbone.View).toBe(true);
  });

  it('exposes delegateEvents from Backbone.View', function() {
    expect(View.prototype.delegateEvents).toBe(Backbone.View.prototype.delegateEvents);
  });

  it('exposes undelegateEvents from Backbone.View', function() {
    expect(View.prototype.undelegateEvents).toBe(Backbone.View.prototype.undelegateEvents);
  });

  describe('when it closes, then enterDOM is called again', function() {

    beforeEach(function() {
      view = new View();

      spyOn(view, 'onDOM');

      view.enterDOM();
      view.close();
      view.enterDOM();
    });

    it('invokes onDOM twice', function() {
      expect(view.onDOM.calls.count()).toBe(2);
    });

  });

});

