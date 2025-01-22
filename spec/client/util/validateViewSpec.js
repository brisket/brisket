import validateView from '../../../lib/util/validateView.js';
import Backbone from '../../../lib/application/Backbone.js';
import View from '../../../lib/viewing/View.js';

describe('validateView', function() {

  it('does NOT throw when passed a Backbone.View', function() {
    function validatingABackboneView() {
      validateView(new Backbone.View());
    }

    expect(validatingABackboneView).not.toThrow();
  });

  it('does NOT throw when passed a Brisket.View', function() {
    function validatingABrisketView() {
      validateView(new View());
    }

    expect(validatingABrisketView).not.toThrow();
  });

  it('throws when passed anything else', function() {
    const anythingElse = [
      1,
      'a string',
      View,
      null,
      undefined
    ];

    anythingElse.forEach(anything => {
      expect(() => {
        validateView(anything);
      }).toThrow();
    });
  });

});

