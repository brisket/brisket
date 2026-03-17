import Errors from '../../../lib/errors/Errors.js';

describe('Errors', function() {
  let eventHandler;
  let mockRequest;
  let error;

  beforeEach(function() {
    eventHandler = jasmine.createSpy('event-handler');
    mockRequest = {};
    Errors.onError(eventHandler);
  });

  describe('when error is a string', function() {

    beforeEach(function() {
      Errors.notify('there was an error', mockRequest);
    });

    it('calls event handler with string', function() {
      expect(eventHandler).toHaveBeenCalledWith(
        'there was an error',
        mockRequest
      );
    });

  });

  describe('when error is a plain object', function() {

    beforeEach(function() {
      Errors.notify({
        some: 'object'
      }, mockRequest);
    });

    it('calls event handler with object', function() {
      expect(eventHandler).toHaveBeenCalledWith({
        some: 'object'
      }, mockRequest);
    });

  });

  describe('when error is an Error object', function() {

    describe('when Error object has stack property (i.e. Node, modern browser)', function() {

      beforeEach(function() {
        error = errorWithStack();
        Errors.notify(error, mockRequest);
      });

      it('calls event handler with error', function() {
        expect(eventHandler).toHaveBeenCalledWith(
          error,
          mockRequest
        );
      });

    });

    describe('when Error object does NOT have stack property (i.e. old browsers)', function() {

      beforeEach(function() {
        error = errorWithoutStack();
        Errors.notify(error, mockRequest);
      });

      it('calls event handler with error', function() {
        expect(eventHandler).toHaveBeenCalledWith(
          error,
          mockRequest
        );
      });

    });

  });

  function errorWithStack() {
    const error = new Error();
    error.stack = error.stack || {}; // in case test runner is in old browser

    return error;
  }

  function errorWithoutStack() {
    const error = new Error();
    delete error.stack;

    return error;
  }

});

