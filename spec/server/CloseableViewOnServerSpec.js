import _ from 'underscore';
import CloseableView from '../../lib/viewing/CloseableView.js';
import Backbone from '../../lib/application/Backbone.js';
import $ from '../../lib/application/jquery.js';

describe('closing CloseableView on server', function() {

  let ViewThatCloses;
  let view;

  describe('#closeAsChild', function() {

    beforeEach(function() {
      Backbone.$ = $;

      ViewThatCloses = Backbone.View.extend(_.extend({}, CloseableView));
      view = new ViewThatCloses();

      spyOn(view, 'onClose');
      spyOn(view, 'trigger');
      spyOn(view, 'remove');
      spyOn(view, 'unbind');

      view.closeAsChild();
    });

    it('removes the view from the DOM', function() {
      expect(view.remove).toHaveBeenCalled();
    });

  });

});

