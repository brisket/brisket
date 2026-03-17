import AjaxCallsForCurrentRequest from '../../lib/server/AjaxCallsForCurrentRequest.js';
import DomainLocalStorage from '../../lib/server/DomainLocalStorage.js';

describe('AjaxCallsForCurrentRequest', function() {

  beforeEach(function() {
    const fakeStorage = {};

    spyOn(DomainLocalStorage, 'get').and.callFake(function(a) {
      return fakeStorage[a];
    });

    spyOn(DomainLocalStorage, 'set').and.callFake(function(a, b) {
      fakeStorage[a] = b;
    });
  });

  describe('when query params are NOT given', function() {

    beforeEach(function() {
      AjaxCallsForCurrentRequest.record('/url', undefined, {
        some: 'data'
      });
    });

    it('records url and data', function() {
      expect(AjaxCallsForCurrentRequest.all()).toEqual(jasmine.objectContaining({
        '/url': {
          some: 'data'
        }
      }));
    });

    itCanClearAllRecordedAjaxCallsForCurrentRequest();

  });

  describe('when query params are given', function() {

    beforeEach(function() {
      AjaxCallsForCurrentRequest.record('/url', {
        query: 'param'
      }, {
        some: 'data'
      });
    });

    it('records url+params and data', function() {
      expect(AjaxCallsForCurrentRequest.all()).toEqual(jasmine.objectContaining({
        '/url%7B%22query%22%3A%22param%22%7D': {
          some: 'data'
        }
      }));
    });

    itCanClearAllRecordedAjaxCallsForCurrentRequest();

  });

  function itCanClearAllRecordedAjaxCallsForCurrentRequest() {
    it('clears all recorded ajax calls for current request', function() {
      AjaxCallsForCurrentRequest.clear();
      expect(AjaxCallsForCurrentRequest.all()).toBeNull();
    });
  }
});

