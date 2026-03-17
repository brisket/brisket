import CloseableView from '../../../lib/viewing/CloseableView.js';
import HasChildViews from '../../../lib/viewing/HasChildViews.js';
import Backbone from '../../../lib/application/Backbone.js';

describe('CloseableView', function() {

  let ViewThatCloses;
  let view;

  describe('#close', function() {

    beforeEach(function() {
      ViewThatCloses = Backbone.View.extend(Object.assign({}, CloseableView));
      view = new ViewThatCloses();

      spyOn(view, 'onClose');
      spyOn(view, 'trigger');
      spyOn(view, 'remove');
      spyOn(view, 'unbind');

      view.close();
    });

    it('removes the view from the DOM', function() {
      expect(view.remove).toHaveBeenCalled();
    });

    it('unbinds all events that were listening to the view', function() {
      expect(view.unbind).toHaveBeenCalled();
    });

    it('alerts listeners that close is happening', function() {
      expect(view.trigger).toHaveBeenCalledWith('close');
    });

    it('calls view\'s onClose handler', function() {
      expect(view.onClose).toHaveBeenCalled();
    });

    describe('when the view does NOT extend HasChildViews', function() {

      beforeEach(function() {
        view = new ViewThatCloses();
      });

      it('does NOT have the method hasChildViews', function() {
        expect(view.hasChildViews).not.toBeDefined();
      });

    });

    describe('when the view extends HasChildViews', function() {

      beforeEach(function() {
        const ParentView = ViewThatCloses.extend(HasChildViews);
        view = new ParentView();
        spyOn(view, 'closeChildViews').and.callThrough();
      });

      describe('when the view has child views', function() {

        beforeEach(function() {
          view.createChildView(ViewThatCloses);
        });

        it('ensures that all child views will be closed', function() {
          view.close();

          expect(view.closeChildViews).toHaveBeenCalled();
        });

        describe('when closeChildViews was called explicitly', function() {

          beforeEach(function() {
            view.closeChildViews();
          });

          it('avoids calling closeChildViews again', function() {
            view.close();

            expect(view.closeChildViews.calls.count()).toBe(1);
          });

        });

      });

      describe('when the view does NOT have any child view', function() {

        beforeEach(function() {
          view.close();
        });

        it('does NOT call closeChildViews', function() {
          expect(view.closeChildViews).not.toHaveBeenCalled();
        });

      });

    });

    describe('when there is an error in onClose', function() {
      let error;
      let catchError;

      beforeEach(function() {
        error = new Error();
        catchError = jasmine.createSpy();

        view.onClose.and.callFake(function() {
          throw error;
        });

        spyOn(console, 'error');

        try {
          view.close();
        } catch (e) {
          catchError(e);
        }
      });

      it('still removes the view from the DOM', function() {
        expect(view.remove).toHaveBeenCalled();
      });

      it('still unbinds all events that were listening to the view', function() {
        expect(view.unbind).toHaveBeenCalled();
      });

      it('reports the error to the console', function() {
        expect(console.error).toHaveBeenCalledWith(
          'Error: There is an error in an onClose callback.\n' +
                    `View with broken onClose is: ${view}`
        );
      });

      it('rethrows error', function() {
        expect(catchError).toHaveBeenCalledWith(error);
      });

    });

  });

  describe('#closeAsChild', function() {

    beforeEach(function() {
      ViewThatCloses = Backbone.View.extend(Object.assign({}, CloseableView));
      view = new ViewThatCloses();

      spyOn(view, 'onClose');
      spyOn(view, 'trigger');
      spyOn(view, 'remove');
      spyOn(view, 'unbind');
      spyOn(view, 'stopListening');
      spyOn(view.$el, 'off');
      spyOn(view.$el, 'removeData');

      view.closeAsChild();
    });

    it('does NOT remove the view from the DOM', function() {
      expect(view.remove).not.toHaveBeenCalled();
    });

    it('unbinds all events that were listening to the view', function() {
      expect(view.unbind).toHaveBeenCalled();
    });

    it('alerts listeners that close is happening', function() {
      expect(view.trigger).toHaveBeenCalledWith('close');
    });

    it('calls view\'s onClose handler', function() {
      expect(view.onClose).toHaveBeenCalled();
    });

    it('stops listening to new events', function() {
      expect(view.stopListening).toHaveBeenCalled();
    });

    it('unbinds all the view\'s $el\'s events', function() {
      expect(view.$el.off).toHaveBeenCalled();
    });

    it('removes all jquery data associated with view\'s el', function() {
      expect(view.$el.removeData).toHaveBeenCalled();
    });

    describe('when there is an error in onClose', function() {
      let error;
      let catchError;

      beforeEach(function() {
        error = new Error();
        catchError = jasmine.createSpy();

        view.onClose.and.callFake(function() {
          throw error;
        });

        spyOn(console, 'error');

        try {
          view.closeAsChild();
        } catch (e) {
          catchError(e);
        }
      });

      it('does NOT remove the view from the DOM', function() {
        expect(view.remove).not.toHaveBeenCalled();
      });

      it('still unbinds all events that were listening to the view', function() {
        expect(view.unbind).toHaveBeenCalled();
      });

      it('stops listening to new events', function() {
        expect(view.stopListening).toHaveBeenCalled();
      });

      it('reports the error to the console', function() {
        expect(console.error).toHaveBeenCalledWith(
          'Error: There is an error in an onClose callback.\n' +
                    `View with broken onClose is: ${view}`
        );
      });

      it('rethrows error', function() {
        expect(catchError).toHaveBeenCalledWith(error);
      });

    });

  });

});

