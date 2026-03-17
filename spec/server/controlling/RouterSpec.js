import Router from '../../../lib/controlling/Router.js';
import noop from '../../../lib/util/noop.js';

describe('Router', function() {

  let router;
  let error;
  let catchError;

  beforeEach(function() {
    router = new Router();
  });

  it('has a noop onClose by default', function() {
    expect(router.onClose).toBe(noop);
  });

  it('has a noop onRouteStart by default', function() {
    expect(router.onRouteStart).toBe(noop);
  });

  it('has a noop onRouteComplete by default', function() {
    expect(router.onRouteComplete).toBe(noop);
  });

  describe('#close', function() {

    beforeEach(function() {
      spyOn(router, 'onClose');

      router.close();
    });

    it('calls router\'s onClose handler', function() {
      expect(router.onClose).toHaveBeenCalled();
    });

    describe('when there is an error in onClose', function() {

      beforeEach(function() {
        error = new Error();
        catchError = jasmine.createSpy();

        router.onClose.and.callFake(function() {
          throw error;
        });

        spyOn(console, 'error');

        try {
          router.close();
        } catch (e) {
          catchError(e);
        }
      });

      it('reports the error to the console', function() {
        expect(console.error).toHaveBeenCalledWith(
          'Error: There is an error in a Router\'s onClose callback.'
        );
      });

      it('rethrows error', function() {
        expect(catchError).toHaveBeenCalledWith(error);
      });

    });

  });

  describe('#renderError', function() {

    it('returns a rejected promise with specified status code', function(done) {
      router.renderError(413).then(null, function(data) {
        expect(data.status).toBe(413);
        done();
      });
    });

  });

});

