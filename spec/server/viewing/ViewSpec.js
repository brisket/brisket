import View from '../../../lib/viewing/View.js';
import Backbone from '../../../lib/application/Backbone.js';
import noop from '../../../lib/util/noop.js';

describe('View', function() {

  it('overwrites delegateEvents', function() {
    expect(View.prototype.delegateEvents).not.toBe(Backbone.View.prototype.delegateEvents);
  });

  it('overwrites undelegateEvents', function() {
    expect(View.prototype.undelegateEvents).not.toBe(Backbone.View.prototype.undelegateEvents);
  });

  describe('Backbone events', function() {
    let ExampleView;
    let view;

    beforeEach(function() {
      ExampleView = View.extend({
        events: {
          'click .sample-element': 'noop'
        },

        noop
      });

      view = new ExampleView();
    });

    it('does not call delegateEvents', function() {
      spyOn(Backbone.View.prototype, 'delegateEvents');
      view.delegateEvents();
      expect(Backbone.View.prototype.delegateEvents).not.toHaveBeenCalled();
    });

    it('does not call undelegateEvents', function() {
      spyOn(Backbone.View.prototype, 'undelegateEvents');
      view.undelegateEvents();
      expect(Backbone.View.prototype.undelegateEvents).not.toHaveBeenCalled();
    });
  });

});

