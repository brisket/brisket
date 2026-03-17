import Backbone from '../../lib/application/Backbone.js';
import ServerRenderingWorkflow from '../../lib/server/ServerRenderingWorkflow.js';
import ServerRenderer from '../../lib/server/ServerRenderer.js';
import ServerRequest from '../../lib/server/ServerRequest.js';
import ServerResponse from '../../lib/server/ServerResponse.js';
import Layout from '../../lib/viewing/Layout.js';
import Errors from '../../lib/errors/Errors.js';

describe('ServerRenderingWorkflow', function() {

  let originalHandler;
  let expectedView;
  let environmentConfig;
  let fakeRouter;
  let PageNotFoundView;
  let ErrorView;
  let mockServerRequest;
  let mockServerResponse;
  let mockExpressRequest;
  let error;

  beforeEach(function() {
    expectedView = new Backbone.View();
    environmentConfig = {
      'made': 'in server rendering spec'
    };

    PageNotFoundView = Backbone.View.extend({
      name: 'page_not_found'
    });

    ErrorView = Backbone.View.extend({
      name: 'unhandled_error'
    });

    originalHandler = function() {};

    spyOn(Errors, 'notify');

    fakeRouter = {
      layout: Layout,
      errorViewMapping: errorViewMapping(),
      otherMethod: jasmine.createSpy(),
      close: jasmine.createSpy()
    };

    spyOn(Layout.prototype, 'render').and.callThrough();
    spyOn(ServerRenderer, 'render').and.returnValue('page was rendered');

    mockServerRequest = {
      id: 'mockServerRequest',
    };

    mockServerResponse = new ServerResponse();
    mockServerResponse.id = 'mockServerResponse';

    spyOn(ServerRequest, 'from').and.returnValue(mockServerRequest);
    spyOn(ServerResponse, 'create').and.returnValue(mockServerResponse);
  });

  it('ensures layout\'s model has environmentConfig', async function() {
    fakeRouter.layout = Layout.extend({
      initialize() {
        expect(this.model.get('environmentConfig')).toEqual({
          'made': 'in server rendering spec'
        });
      }
    });

    await callAugmentedRouterHandler();
  });

  describe('whenever handler is called', function() {

    beforeEach(function() {
      originalHandler = jasmine.createSpy().and.callFake(function() {
        return expectedView;
      });
    });

    it('calls original handler with params, setLayoutData, brisketRequest, and brisketResponse', async function() {
      await callAugmentedRouterHandlerWith('param1', 'param2');

      expect(originalHandler)
        .toHaveBeenCalledWith('param1', 'param2', jasmine.any(Function), mockServerRequest, mockServerResponse);
    });

  });

  describe('when original handler uses \'this\'', function() {

    beforeEach(function() {
      originalHandler = function() {
        this.otherMethod();
      };
    });

    it('ensures original handler\'s scope is bound to router', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expect(fakeRouter.otherMethod).toHaveBeenCalled();
      }
    });

  });

  describe('when original handler redirects', function() {
    let restOfCodeInTheHandler;

    beforeEach(function() {
      restOfCodeInTheHandler = jasmine.createSpy('rest of code in the handler');

      originalHandler = function(layout, request, response) {
        response.redirect('go/somewhere');
        restOfCodeInTheHandler();
        return expectedView;
      };
    });

    it('does NOT execute the rest of code in the handler', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expect(restOfCodeInTheHandler).not.toHaveBeenCalled();
      }
    });

    it('does NOT render a View', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expect(ServerRenderer.render).not.toHaveBeenCalled();
      }
    });

    itPassesEmptyRouteStateToLayout();
    itCleansUpLayoutAndRouter();
  });

  describe('setting response headers', function() {

    it('sets serverResponse headers \'response.set\' is called', async function() {
      originalHandler = function(layout, request, response) {
        response.set('Cache-control', 'public, max-age=3600');

        return expectedView;
      };

      const { serverResponse } = await callAugmentedRouterHandler();

      const headers = serverResponse.headers;

      expect(headers).toEqual(jasmine.objectContaining({
        'Cache-control': 'public, max-age=3600'
      }));
    });

  });

  describe('when original handler does NOT return a View NOR promise of View', function() {

    beforeEach(function() {
      originalHandler = function() {
        return null;
      };
    });

    it('does NOT render page without View', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expectNotToRender(jasmine.any(Layout), null);
      }
    });

    it('still renders Layout', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expect(Layout.prototype.render).toHaveBeenCalled();
      }
    });

    it('renders error view', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expectRenderFor(jasmine.any(Layout), jasmine.any(ErrorView));
      }
    });

    it('returns 500 status', async function() {
      const { serverResponse } = await callAugmentedRouterHandler();

      expect(serverResponse.statusCode).toBe(500);
    });

  });

  describe('when original handler returns View', function() {

    beforeEach(function() {
      originalHandler = function() {
        return expectedView;
      };
    });

    it('renders page', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expectRenderFor(jasmine.any(Layout), expectedView);
      }
    });

    it('returns promise of rendered page', async function() {
      const { html } = await callAugmentedRouterHandler();

      expect(html).toBe('page was rendered');
    });

    itPassesRouteStateToLayout();
    itCleansUpLayoutAndRouter();
  });

  describe('when original handler returns promise of View', function() {

    beforeEach(function() {
      originalHandler = function() {
        return Promise.resolve(expectedView);
      };
    });

    it('render page', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expectRenderFor(jasmine.any(Layout), expectedView);
      }
    });

    it('returns promise of rendered page', async function() {
      const { html } = await callAugmentedRouterHandler();

      expect(html).toBe('page was rendered');
    });

    itPassesRouteStateToLayout();
    itCleansUpLayoutAndRouter();
  });

  describe('when original handler returns rejected promise', function() {

    beforeEach(function() {
      error = new Error('original handler returns rejected promise');

      originalHandler = function() {
        return Promise.reject(error);
      };
    });

    it('logs the error', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expect(Errors.notify).toHaveBeenCalledWith(
          error,
          mockExpressRequest
        );
      }
    });

    itPassesEmptyRouteStateToLayout();
    itCleansUpLayoutAndRouter();
    itDoesNotRethrowError();
  });

  describe('when original handler returns with a 404', function() {

    beforeEach(function() {
      error = {
        status: 404
      };

      originalHandler = function() {
        return Promise.reject(error);
      };
    });

    it('still renders Layout', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expect(Layout.prototype.render).toHaveBeenCalled();
      }
    });

    it('renders 404 view', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expectRenderFor(jasmine.any(Layout), jasmine.any(PageNotFoundView));
      }
    });

    it('returns status of 404', async function() {
      const { serverResponse } = await callAugmentedRouterHandler();

      expect(serverResponse.statusCode).toBe(404);
    });

    itPassesEmptyRouteStateToLayout();
    itCleansUpLayoutAndRouter();
    itDoesNotRethrowError();
  });

  describe('when original handler returns with a 500', function() {

    beforeEach(function() {
      error = {
        status: 500
      };

      originalHandler = function() {
        return Promise.reject(error);
      };
    });

    it('still renders Layout', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expect(Layout.prototype.render).toHaveBeenCalled();
      }
    });

    it('renders error view', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expectRenderFor(jasmine.any(Layout), jasmine.any(ErrorView));
      }
    });

    it('returns status of 500', async function() {
      const { serverResponse } = await callAugmentedRouterHandler();

      expect(serverResponse.statusCode).toBe(500);
    });

    itPassesEmptyRouteStateToLayout();
    itCleansUpLayoutAndRouter();
    itDoesNotRethrowError();
  });

  describe('when original handler returns error (not 500 or 404)', function() {

    beforeEach(function() {
      error = {
        status: 503
      };

      originalHandler = function() {
        return Promise.reject(error);
      };
    });

    it('still renders Layout', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expect(Layout.prototype.render).toHaveBeenCalled();
      }
    });

    it('renders error view', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expectRenderFor(jasmine.any(Layout), jasmine.any(ErrorView));
      }
    });

    it('returns status of 500', async function() {
      const { serverResponse } = await callAugmentedRouterHandler();

      expect(serverResponse.statusCode).toBe(500);
    });

    itPassesEmptyRouteStateToLayout();
    itCleansUpLayoutAndRouter();
    itDoesNotRethrowError();
  });

  describe('when original handler returns error and layout fetch data succeeds', function() {

    beforeEach(function() {
      const LayoutWithSuccessfulFetch = Layout.extend({
        fetchData() {
          return Promise.resolve();
        }
      });

      fakeRouter = {
        layout: LayoutWithSuccessfulFetch,
        errorViewMapping: errorViewMapping(),
        close: jasmine.createSpy()
      };

      error = {
        status: 404
      };

      originalHandler = function() {
        return Promise.reject(error);
      };
    });

    it('still renders Layout', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expect(Layout.prototype.render).toHaveBeenCalled();
      }
    });

    it('returns status from view failure', async function() {
      const { serverResponse } = await callAugmentedRouterHandler();

      expect(serverResponse.statusCode).toBe(404);
    });

    itPassesEmptyRouteStateToLayout();
    itCleansUpLayoutAndRouter();
    itDoesNotRethrowError();
  });

  describe('when original handler returns error and layout fetch data returns error', function() {

    beforeEach(function() {
      error = {
        status: 404
      };

      const LayoutWithFailingFetch = Layout.extend({
        fetchData() {
          return Promise.reject(error);
        }
      });

      fakeRouter = {
        layout: LayoutWithFailingFetch,
        errorViewMapping: errorViewMapping(),
        close: jasmine.createSpy()
      };

      originalHandler = function() {
        return Promise.reject({
          status: 500
        });
      };

    });

    it('still renders Layout', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expect(Layout.prototype.render).toHaveBeenCalled();
      }
    });

    it('returns status from view failure', async function() {
      const { serverResponse } = await callAugmentedRouterHandler();

      expect(serverResponse.statusCode).toBe(500);
    });

    itPassesEmptyRouteStateToLayout();
    itCleansUpLayoutAndRouter();
    itDoesNotRethrowError();
  });

  describe('when original handler has an uncaught error', function() {

    beforeEach(function() {
      error = new Error('original handler has uncaught error');

      originalHandler = function() {
        throw error;
      };
    });

    it('still renders Layout', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expect(Layout.prototype.render).toHaveBeenCalled();
      }
    });

    it('renders error view', async function() {
      try {
        await callAugmentedRouterHandler();
      } finally {
        expectRenderFor(jasmine.any(Layout), jasmine.any(ErrorView));
      }
    });

    it('returns status of 500', async function() {
      const { serverResponse } = await callAugmentedRouterHandler();

      expect(serverResponse.statusCode).toBe(500);
    });

    itPassesEmptyRouteStateToLayout();
    itCleansUpLayoutAndRouter();
    itDoesNotRethrowError();
  });

  describe('when layout errors on close', function() {

    beforeEach(function() {
      error = new Error('layout close error');

      spyOn(Layout.prototype, 'onClose').and.callFake(function() {
        throw error;
      });
    });

    itNotifiesAboutError();
    itRethrowsError();
  });

  describe('when router errors on close', function() {

    beforeEach(function() {
      error = new Error('router close error');

      fakeRouter.close.and.callFake(function() {
        throw error;
      });
    });

    itNotifiesAboutError();
    itRethrowsError();
  });

  describe('when router doesn\'t have errorViewMapping and there is an error', function() {

    beforeEach(function() {
      fakeRouter.errorViewMapping = null;

      originalHandler = function() {
        return Promise.reject(error);
      };
    });

    itNotifiesAboutError();
    itRethrowsError();
  });

  function itPassesRouteStateToLayout() {

    it('passes recorded state as model to layout', async function() {
      originalHandler = function(setLayoutData) {
        setLayoutData('key1', 'value1');
        setLayoutData({
          'key2': 'value2',
          'key3': 'value3'
        });

        return expectedView;
      };

      fakeRouter.layout = Layout.extend({
        initialize() {
          expect(this.model.get('key1')).toBe('value1');
          expect(this.model.get('key2')).toBe('value2');
          expect(this.model.get('key3')).toBe('value3');
        }
      });

      await callAugmentedRouterHandler();
    });

  }

  function itPassesEmptyRouteStateToLayout() {

    it('passes empty state as model to layout', async function() {
      originalHandler = function(setLayoutData) {
        setLayoutData('key1', 'value1');
        setLayoutData({
          'key2': 'value2',
          'key3': 'value3'
        });

        throw new Error();
      };

      fakeRouter.layout = Layout.extend({
        initialize() {
          expect(this.model.attributes).toEqual({
            environmentConfig
          });
        }
      });

      await callAugmentedRouterHandler();
    });

  }

  function itNotifiesAboutError() {
    it('notifies about error', async function() {
      try {
        await callAugmentedRouterHandler();
      } catch(e) {
        expect(Errors.notify).toHaveBeenCalledWith(
          error,
          mockExpressRequest
        );
      }
    });
  }

  function itDoesNotRethrowError() {
    it('does NOT rethrow error', async function() {
      try {
        await callAugmentedRouterHandler();
      } catch(e) {
        expect(e).not.toBe(error);
      }
    });
  }

  function itRethrowsError() {
    it('rethrows error', async function() {
      try {
        await callAugmentedRouterHandler()
      } catch (e) {
        expect(e).toBe(error);
      }
    });
  }

  function itCleansUpLayoutAndRouter() {
    describe('cleaning up', function() {

      beforeEach(function() {
        spyOn(Layout.prototype, 'close');
      });

      it('cleans up layout', async function() {
        try {
          await callAugmentedRouterHandler();
        } finally {
          expect(Layout.prototype.close).toHaveBeenCalled();
        }
      });

      it('cleans up router', async function() {
        try {
          await callAugmentedRouterHandler();
        } finally {
          expect(fakeRouter.close).toHaveBeenCalled();
        }
      });

    });
  }

  function expectRenderFor(layout, view) {
    expect(ServerRenderer.render).toHaveBeenCalledWith(
      layout,
      view,
      environmentConfig,
      mockServerRequest
    );
  }

  function expectNotToRender(layout, view) {
    expect(ServerRenderer.render).not.toHaveBeenCalledWith(
      layout,
      view,
      environmentConfig,
      mockServerRequest
    );
  }

  async function callAugmentedRouterHandler() {
    return callAugmentedRouterHandlerWith();
  }

  async function callAugmentedRouterHandlerWith() {
    const params = makeBackboneRouteArguments(arguments);

    mockExpressRequest = makeMockExpressRequest();

    return ServerRenderingWorkflow.execute(
      fakeRouter,
      originalHandler,
      params,
      mockExpressRequest,
      environmentConfig
    );
  }

  function errorViewMapping() {
    return {
      404: PageNotFoundView,
      500: ErrorView
    };
  }

  function makeMockExpressRequest() {
    return {
      protocol: 'http',
      path: '/requested/path',
      host: 'example.com',
      headers: {
        'host': 'example.com',
        'user-agent': 'A wonderful computer'
      }
    };
  }

  function makeBackboneRouteArguments(args) {
    return Array.prototype.slice.call(args, 0).concat(null);
  }

});

