import qs from 'qs';
import nock from 'nock';
import ServerAjax from '../../lib/server/ServerAjax.js';
import AjaxCallsForCurrentRequest from '../../lib/server/AjaxCallsForCurrentRequest.js';
import Backbone from 'backbone';

describe('ServerAjax', function() {
  let ajaxSuccessCallback;
  let ajaxErrorCallback;
  let apiScope, otherApiScope, marketsApiScope, apiWithHeadersScope, apiWithParamsScope;

  describe('when apis config available', function() {

    beforeEach(function() {
      apiScope = nock('http://api.example.com');
      otherApiScope = nock('http://other-api.example.com');
      marketsApiScope = nock('http://markets.example.com');

      ajaxSuccessCallback = jasmine.createSpy('ajaxSuccessCallback');
      ajaxErrorCallback = jasmine.createSpy('ajaxErrorCallback');

      spyOn(AjaxCallsForCurrentRequest, 'record');

      ServerAjax.setup({
        'api': {
          host: 'http://api.example.com',
        },
        'nav': {
          host: 'http://other-api.example.com',
          timeout: 5000
        }
      });
    });

    afterEach(function() {
      ServerAjax.reset();
      nock.cleanAll();
    });

    it('sends request to the correct api', async function() {
      givenApiRequestWillSucceed();

      await Backbone.ajax({
        url: '/api/path/to/data'
      });

      thenRequestMadeToApi();

      givenOtherApiRequestWillSucceed();
      await Backbone.ajax({
        url: '/nav/path/to/data'
      });

      thenRequestMadeToOtherApi();
    });

    it('errors when url doesn\'t match any api', async function() {
      givenKnownApiRequestsWillSucceed();

      try {
        await Backbone.ajax({
          url: '/unknown/path/to/data'
        });
      } catch (e) {
        expect(e).toBeDefined('Expected request to api that is not in apiConfig to fail');
      }
    });

    it('sends request to the correct api when leading slash left off', async function() {
      givenApiRequestWillSucceed();

      await Backbone.ajax({
        url: 'api/path/to/data'
      });

      thenRequestMadeToApi();

      givenOtherApiRequestWillSucceed();

      await Backbone.ajax({
        url: 'nav/path/to/data'
      });

      thenRequestMadeToOtherApi();
    });

    it('sends request with query params when they are passed', async function() {
      givenApiRequestWithParamsWillSucceed();

      await Backbone.ajax({
        url: '/api/path/to/data',
        data: {
          a: 'param1',
          b: [
            'b1',
            'b2'
          ]
        }
      });

      thenRequestMadeToApiWithParams();

      thenAjaxCallIsRecorded('/api/path/to/data', {
        a: 'param1',
        b: [
          'b1',
          'b2'
        ]
      }, {
        some: 'data'
      });
    });

    it('sends request with headers when they are passed', async function() {
      givenApiRequestWithHeadersWillSucceed();

      await Backbone.ajax({
        url: '/api/path/to/data',
        headers: {
          'x-my-custom-header': 'some value',
          'x-some-other-header': 'some other value'
        }
      });

      thenRequestMadeToApiWithHeaders();

      thenAjaxCallIsRecorded('/api/path/to/data', undefined, {
        some: 'data'
      });
    });

    it('calls success callback with returned data when api request succceeds', async function() {
      givenApiRequestWillSucceed();

      await Backbone.ajax({
        url: '/api/path/to/data',
        success: ajaxSuccessCallback,
        error: ajaxErrorCallback
      });

      expect(ajaxSuccessCallback).toHaveBeenCalledWith({
        some: 'data'
      });

      expect(ajaxErrorCallback).not.toHaveBeenCalled();

      thenAjaxCallIsRecorded('/api/path/to/data', undefined, {
        some: 'data'
      });
    });

    it('calls success callback with returned non-JSON data when api request succeeds', async function() {
      givenApiRequestWillSucceedNonJSON();

      await Backbone.ajax({
        url: '/api/path/to/data',
        success: ajaxSuccessCallback,
        error: ajaxErrorCallback,
      });

      expect(ajaxSuccessCallback).toHaveBeenCalledWith('data');
      expect(ajaxErrorCallback).not.toHaveBeenCalled();
      thenAjaxCallIsRecorded('/api/path/to/data', undefined, 'data');
    });

    it('calls error callback with returned data when api request fails', async function() {
      givenApiRequestWillFail();

      try {
        await Backbone.ajax({
          url: '/api/path/to/data',
          success: ajaxSuccessCallback,
          error: ajaxErrorCallback
        });
      } catch (e) {
        expect(ajaxErrorCallback).toHaveBeenCalledWith({
          url: 'http://api.example.com/path/to/data',
          proxy: null,
          status: 500,
          response: {
            error: 'reason'
          }
        }, 500, new Error('Server responded with a status of 500'));

        expect(ajaxSuccessCallback).not.toHaveBeenCalled();

        thenAjaxCallIsNOTRecorded();
      }
    });

    it('bubbles error from success callback', async function() {
      givenApiRequestWillSucceed();

      const error = new Error();

      ajaxSuccessCallback.and.throwError(error);

      try {
        await Backbone.ajax({
          url: '/api/path/to/data',
          success: ajaxSuccessCallback,
          error: ajaxErrorCallback
        });
      } catch (reason) {
        expect(reason).toBe(error);
      }
    });

    it('bubbles error from error callback', async function() {
      givenApiRequestWillFail();

      const error = new Error();

      ajaxErrorCallback.and.throwError(error);

      try {
        await Backbone.ajax({
          url: '/api/path/to/data',
          success: ajaxSuccessCallback,
          error: ajaxErrorCallback
        });
      } catch (reason) {
        expect(reason).toBe(error);
      }
    });

    describe('apis alias has slashes', function() {

      beforeEach(function() {
        ServerAjax.setup({
          'api': {
            host: 'http://api.example.com',
          },
          'markets/api': {
            host: 'http://markets.example.com',
            timeout: 5000
          }
        });
      });

      it('sends request to the correct api', async function() {
        givenMarketsApiRequestWillSucceed();

        await Backbone.ajax({
          url: '/markets/api/path/to/data'
        });

        thenRequestMadeToMarketsApi();

        givenApiRequestWillSucceed();

        await Backbone.ajax({
          url: '/api/path/to/data'
        });

        thenRequestMadeToApi();
      });
    });

  });

  function givenApiRequestWillSucceedNonJSON() {
    apiScope
      .get('/path/to/data')
      .reply(200, 'data', {
        'content-type': 'application/json'
      });
  }

  function givenKnownApiRequestsWillSucceed() {
    givenApiRequestWillSucceed();
    givenOtherApiRequestWillSucceed();
    givenMarketsApiRequestWillSucceed();
  }

  function givenApiRequestWillSucceed() {
    apiScope
      .get('/path/to/data')
      .reply(200, {
        some: 'data'
      }, {
        'content-type': 'application/json'
      });
  }

  function givenApiRequestWithParamsWillSucceed() {
    const formattedParams = qs.stringify({
      a: 'param1',
      b: [
        'b1',
        'b2'
      ]
    }, { arrayFormat: 'brackets' });

    apiWithParamsScope = nock('http://api.example.com', { encodedQueryParams: true })
      .get(`/path/to/data?${formattedParams}`)
      .reply(200, {
        some: 'data'
      }, {
        'content-type': 'application/json'
      });
  }

  function givenApiRequestWithHeadersWillSucceed() {
    apiWithHeadersScope = nock('http://api.example.com', {
      reqheaders: {
        'x-my-custom-header': 'some value',
        'x-some-other-header': 'some other value'
      },
    })
      .get('/path/to/data')
      .reply(200, {
        some: 'data'
      }, {
        'content-type': 'application/json'
      });
  }

  function givenOtherApiRequestWillSucceed() {
    otherApiScope
      .get('/path/to/data')
      .reply(200, {
        some: 'data'
      }, {
        'content-type': 'application/json'
      });
  }

  function givenMarketsApiRequestWillSucceed() {
    marketsApiScope
      .get('/path/to/data')
      .reply(200, {
        some: 'data'
      }, {
        'content-type': 'application/json'
      });
  }

  function givenApiRequestWillFail() {
    apiScope
      .get('/path/to/data')
      .reply(500, {
        error: 'reason'
      }, {
        'content-type': 'application/json'
      });
  }

  function thenAjaxCallIsRecorded(originalUrl, queryParams, data) {
    expect(AjaxCallsForCurrentRequest.record).toHaveBeenCalledWith(originalUrl, queryParams, data);
  }

  function thenAjaxCallIsNOTRecorded() {
    expect(AjaxCallsForCurrentRequest.record).not.toHaveBeenCalled();
  }

  function thenRequestMadeToApi() {
    apiScope.done();
  }

  function thenRequestMadeToApiWithParams() {
    apiWithParamsScope.done();
  }

  function thenRequestMadeToApiWithHeaders() {
    apiWithHeadersScope.done();
  }

  function thenRequestMadeToOtherApi() {
    otherApiScope.done();
  }

  function thenRequestMadeToMarketsApi() {
    marketsApiScope.done();
  }

});
