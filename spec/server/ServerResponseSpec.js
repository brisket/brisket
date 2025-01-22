import ServerResponse from '../../lib/server/ServerResponse.js';

describe('ServerResponse', function() {

  let serverResponse;

  beforeEach(function() {
    serverResponse = new ServerResponse();
  });

  describe('#set', function() {

    it('sets header by field and value', function() {
      serverResponse.set('Cache-control', 'must-revalidate');

      expect(serverResponse.headers).toEqual(jasmine.objectContaining({
        'Cache-control': 'must-revalidate'
      }));
    });

    it('sets headers by object with field/value pairs', function() {
      serverResponse.set({
        'Cache-control': 'private',
        'Vary': 'Accept-Encoding'
      });

      expect(serverResponse.headers).toEqual(jasmine.objectContaining({
        'Cache-control': 'private',
        'Vary': 'Accept-Encoding'
      }));
    });

  });

});

