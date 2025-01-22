import ClientRenderer from '../../../lib/client/ClientRenderer.js';
import Layout from '../../../lib/viewing/Layout.js';
import View from '../../../lib/viewing/View.js';

describe('ClientRenderer', function() {

  let layout;
  let view;

  beforeEach(function() {
    layout = new Layout();
    spyOn(layout, 'reattach');
    spyOn(layout, 'render');
    spyOn(layout, 'enterDOM');
    spyOn(layout, 'setContentToAttachedView');
    spyOn(layout, 'setContent');

    view = new View();
    spyOn(view, 'render');
    spyOn(view, 'reattach');
    spyOn(view, 'enterDOM');
    spyOn(view, 'setUid');
  });

  describe('on all renders', function() {

    beforeEach(function() {
      whenClientRenders(1);
    });

    it('attempts to reattach view', function() {
      expect(view.reattach).toHaveBeenCalled();
    });

  });

  describe('when view is attached', function() {

    beforeEach(function() {
      view.isAttached = true;
      whenClientRenders(1);
    });

    it('renders the view', function() {
      expect(view.render).toHaveBeenCalled();
    });

    it('sets the layout\'s content as the attached view', function() {
      expect(layout.setContentToAttachedView).toHaveBeenCalledWith(view);
    });

    it('does NOT directly set layout\'s content', function() {
      expect(layout.setContent).not.toHaveBeenCalled();
    });

  });

  describe('when view is NOT attached', function() {

    beforeEach(function() {
      view.isAttached = false;
      whenClientRenders(1);
    });

    it('does NOT render the view directly', function() {
      expect(view.render).not.toHaveBeenCalled();
    });

    it('does NOT set the layout\'s content as the attached view', function() {
      expect(layout.setContentToAttachedView).not.toHaveBeenCalledWith(view);
    });

    it('sets the layout\'s content', function() {
      expect(layout.setContent).toHaveBeenCalled();
    });

  });

  describe('when view is Brisket.View', function() {

    beforeEach(function() {
      whenClientRenders(1);
    });

    it('sets uid to reflect current request and it\'s creation order', function() {
      expect(view.setUid).toHaveBeenCalledWith('1|0_1');
    });

  });

  function whenClientRenders(requestId) {
    ClientRenderer.render(layout, view, requestId);
  }

});

