import ClientRenderingWorkflow from '../../../lib/client/ClientRenderingWorkflow.js';
import ClientRenderer from '../../../lib/client/ClientRenderer.js';
import ClientRequest from '../../../lib/client/ClientRequest.js';
import ClientResponse from '../../../lib/client/ClientResponse.js';
import Layout from '../../../lib/viewing/Layout.js';
import View from '../../../lib/viewing/View.js';
import mockWindow from '../../mock/mockWindow.js';
import Errors from '../../../lib/errors/Errors.js';

describe('ClientRenderingWorkflow', function() {
  let expectedView;
  let expectedView2;
  let firstRequestRouter;
  let FirstRequestLayout;
  let PageNotFoundView;
  let ErrorView;
  let windough;
  let mockClientRequest;
  let mockClientResponse;
  let error;

  const timedPromiseMaker = resolves => value => {
    return {
      inMs(ms) {
        return new Promise((resolve, reject) => {
          const resolveOrReject = resolves ? resolve : reject;
          setTimeout(() => {
            resolveOrReject(value);
          }, ms);
        });
      },
      instantly() {
        return resolves ? Promise.resolve(value) : Promise.reject(value);
      }
    };
  };

  const resolvesWith = timedPromiseMaker(true);
  const rejectsWith = timedPromiseMaker(false);

  const SIMPLE_HANDLER = function() {
    return expectedView;
  };

  beforeEach(function() {
    const FirstRequestView = View.extend({
      template: 'first_request',
      name: 'first_request',
    });

    const SecondRequestView = View.extend({
      template: 'second_request',
      name: 'second_request',
    });

    expectedView = new FirstRequestView();
    expectedView2 = new SecondRequestView();

    PageNotFoundView = View.extend({
      template: 'page_not_found',
      name: 'page_not_found'
    });
    ErrorView = View.extend({
      template: 'unhandled_error',
      name: 'unhandled_error'
    });

    FirstRequestLayout = Layout.extend({
      template: 'first_request_layout',
      name: 'first_request_layout',

      testCommand: jasmine.createSpy('first request layout test command'),
    });

    firstRequestRouter = makeFakeRouter('first request', {
      layout: FirstRequestLayout,
    });

    spyOn(Errors, 'notify');

    spyOn(ClientRenderer, 'render').and.returnValue('page was rendered');

    windough = mockWindow();

    mockClientResponse = new ClientResponse(windough);

    const originalClientRequestFrom = ClientRequest.from;

    spyOn(ClientRequest, 'from').and.callFake(function() {
      mockClientRequest = originalClientRequestFrom.apply(null, arguments);

      spyOn(mockClientRequest, 'off').and.callThrough();

      return mockClientRequest;
    });
    spyOn(ClientResponse, 'from').and.returnValue(mockClientResponse);

    spyOn(Layout.prototype, 'close');
  });

  afterEach(function() {
    error = null;
    ClientRenderingWorkflow.reset();
  });

  describe('exposing environmentConfig to layout for rendering', function() {

    beforeEach(function() {
      ClientRenderingWorkflow.setEnvironmentConfig({
        'made': 'in client rendering spec'
      });
    });

    it('ensures layout\'s model has environmentConfig', async function() {
      firstRequestRouter.layout = Layout.extend({

        initialize() {
          expect(this.model.get('environmentConfig')).toEqual({
            'made': 'in client rendering spec'
          });
        }

      });

      const handler = function(layout) {
        layout.testEnvironmentConfig();

        return expectedView;
      };

      await execute(handler);
    });
  });

  describe('setting response headers', function() {
    it('does NOT throw an error when \'response.set\' is called', async function() {
      const handler = function(layout, request, response) {
        function callingResponseSet() {
          response.set('Cache-control', 'public, max-age=3600');
        }

        expect(callingResponseSet).not.toThrow();

        return expectedView;
      };

      await execute(handler);
    });

  });

  describe('when original handler uses \'this\'', function() {

    it('ensures original handler\'s scope is bound to router', async function() {
      const handler = function() {
        this.otherMethod();
      };

      await execute(handler);

      expect(firstRequestRouter.otherMethod).toHaveBeenCalled();
    });

  });

  describe('whenever handler is called', function() {

    it('calls original handler with params, layout, brisketRequest, and brisketResponse', async function() {
      const handler = jasmine.createSpy('whenever handler is called');

      await executeWith({
        handler,
        router: firstRequestRouter,
        args: ['param1', 'param2'],
      });

      expect(handler).toHaveBeenCalledWith(
        'param1',
        'param2',
        jasmine.any(Function),
        mockClientRequest,
        mockClientResponse
      );
    });

  });

  describe('when original handler redirects', function() {
    let restOfCodeInTheHandler;
    let handler;

    beforeEach(function() {
      restOfCodeInTheHandler = jasmine.createSpy('rest of code in the handler');

      handler = function(layout, request, response) {
        response.redirect('go/somewhere');
        restOfCodeInTheHandler();
        return expectedView;
      };
    });

    it('does NOT execute the rest of code in the handler', async function() {
      await execute(handler);

      expect(restOfCodeInTheHandler).not.toHaveBeenCalled();
    });

    it('does NOT render a View', async function() {
      await execute(handler);

      expect(ClientRenderer.render).not.toHaveBeenCalled();
    });

    it('unbinds request.onComplete handlers', async function() {
      await itUnbindsRequestOnCompleteHandlersWhen(handler);
    });

    it('cleans up router', async function() {
      await itCleansUpRouterWhen(handler);
    });
  });

  describe('when original handler does NOT return a View NOR promise of View', function() {
    let handler;

    beforeEach(function() {
      handler = function() {
        return null;
      };
    });

    it('does NOT render without View', async function() {
      await execute(handler);

      expectNotToRender(null);
    });

    it('renders error view', async function() {
      await execute(handler);

      expectRenderFor(jasmine.any(ErrorView));
    });

  });

  describe('when original handler returns View', function() {
    let handler;

    beforeEach(function() {
      handler = SIMPLE_HANDLER;
    });

    it('renders page', async function() {
      await execute(handler);

      expectRenderFor(expectedView);
    });

    it('returns promise of rendered page', async function() {
      const html = await execute(handler);

      expect(html).toBe('page was rendered');
    });

    it('unbinds request.onComplete handlers', async function() {
      await itUnbindsRequestOnCompleteHandlersWhen(handler);
    });

    it('cleans up router', async function() {
      await itCleansUpRouterWhen(handler);
    });
  });

  describe('when original handler returns promise of View', function() {
    let handler;

    beforeEach(function() {
      handler = function() {
        return resolvesWith(expectedView).instantly();
      };
    });

    it('render page', async function() {
      await execute(handler);

      expectRenderFor(expectedView);
    });

    it('returns promise of rendered page', async function() {
      const html = await execute(handler);

      expect(html).toBe('page was rendered');
    });

    it('unbinds request.onComplete handlers', async function() {
      await itUnbindsRequestOnCompleteHandlersWhen(handler);
    });

    it('cleans up router', async function() {
      await itCleansUpRouterWhen(handler);
    });
  });

  describe('when original handler returns a rejected promise', function() {
    let handler;

    beforeEach(function() {
      error = 'original handler returns a rejected promise';

      handler = function() {
        return Promise.reject(error);
      };
    });

    it('logs the error to console', async function() {
      await execute(handler);

      expect(Errors.notify).toHaveBeenCalledWith(
        'original handler returns a rejected promise',
        mockClientRequest
      );
    });

    it('unbinds request.onComplete handlers', async function() {
      await itUnbindsRequestOnCompleteHandlersWhen(handler);
    });

    it('cleans up router', async function() {
      await itCleansUpRouterWhen(handler);
    });

    it('does NOT rethrow error', async function() {
      await itDoesNotRethrowErrorWhen(handler);
    });
  });

  describe('when original handler returns with a 404', function() {
    let handler;

    beforeEach(function() {
      error = {
        status: 404
      };

      handler = function() {
        return Promise.reject(error);
      };
    });

    it('renders 404 view', async function() {
      await execute(handler);

      expectRenderFor(jasmine.any(PageNotFoundView));
    });

    it('logs the jqxhr to console', async function() {
      await execute(handler);

      expect(Errors.notify.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({
        status: 404
      }));
    });

    it('unbinds request.onComplete handlers', async function() {
      await itUnbindsRequestOnCompleteHandlersWhen(handler);
    });

    it('cleans up router', async function() {
      await itCleansUpRouterWhen(handler);
    });

    it('does NOT rethrow error', async function() {
      await itDoesNotRethrowErrorWhen(handler);
    });
  });

  describe('when original handler returns with a 500', function() {
    let handler;

    beforeEach(function() {
      error = {
        status: 500
      };

      handler = function() {
        return Promise.reject(error);
      };
    });

    it('renders error view', async function() {
      await execute(handler);

      expectRenderFor(jasmine.any(ErrorView));
    });

    it('logs the jqxhr to console', async function() {
      await execute(handler);

      expect(Errors.notify.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({
        status: 500
      }));
    });

    it('unbinds request.onComplete handlers', async function() {
      await itUnbindsRequestOnCompleteHandlersWhen(handler);
    });

    it('cleans up router', async function() {
      await itCleansUpRouterWhen(handler);
    });

    it('does NOT rethrow error', async function() {
      await itDoesNotRethrowErrorWhen(handler);
    });
  });

  describe('when original handler returns error (not 500 or 404)', function() {
    let handler;

    beforeEach(function() {
      error = {
        status: 503
      };

      handler = function() {
        return Promise.reject(error);
      };
    });

    it('renders error view', async function() {
      await execute(handler);

      expectRenderFor(jasmine.any(ErrorView));
    });

    it('logs the jqxhr to console', async function() {
      await execute(handler);

      expect(Errors.notify.calls.mostRecent().args[0]).toEqual(jasmine.objectContaining({
        status: 503
      }));
    });

    it('unbinds request.onComplete handlers', async function() {
      await itUnbindsRequestOnCompleteHandlersWhen(handler);
    });

    it('cleans up router', async function() {
      await itCleansUpRouterWhen(handler);
    });

    it('does NOT rethrow error', async function() {
      await itDoesNotRethrowErrorWhen(handler);
    });
  });

  describe('when original handler has an uncaught error', function() {
    let expectedError;
    let handler;

    beforeEach(function() {
      expectedError = new Error('original handler has uncaught error');

      handler = () => { throw expectedError; }
    });

    it('renders error view', async function() {
      await execute(handler);

      expectRenderFor(jasmine.any(ErrorView));
    });

    it('logs the jqxhr to console', async function() {
      await execute(handler);

      expect(Errors.notify).toHaveBeenCalledWith(
        expectedError,
        mockClientRequest
      );
    });

    it('unbinds request.onComplete handlers', async function() {
      await itUnbindsRequestOnCompleteHandlersWhen(handler);
    });

    it('cleans up router', async function() {
      await itCleansUpRouterWhen(handler);
    });

    it('does NOT rethrow error', async function() {
      await itDoesNotRethrowErrorWhen(handler);
    });
  });

  describe('the first client side render', function() {
    let handler;

    beforeEach(function() {
      handler = function(setLayoutData) {
        setLayoutData('key1', 'value1');
        setLayoutData({
          'key2': 'value2',
          'key3': 'value3',
        });

        return expectedView;
      };

      spyOn(Layout.prototype, 'fetchData');
    });

    it('passes recorded state as model to layout', async function() {
      firstRequestRouter.layout = Layout.extend({
        initialize() {
          expect(this.model.get('key1')).toBe('value1');
          expect(this.model.get('key2')).toBe('value2');
          expect(this.model.get('key3')).toBe('value3');
        }
      });

      await execute(handler);
    });

    it('fetches layout data', async function() {
      await execute(handler);

      expect(Layout.prototype.fetchData).toHaveBeenCalled();
    });

    it('cleans up router', async function() {
      await itCleansUpRouterWhen(handler);
    });
  });

  describe('all client side renders except for the first', function() {
    let firstHandler;
    let secondHandler;
    let layoutModelChanged;
    const HASNT_CHANGED = {};

    beforeEach(function() {
      layoutModelChanged = HASNT_CHANGED;

      FirstRequestLayout.prototype.initialize = function() {
        this.model.on({
          'change': function() {
            layoutModelChanged = this.model.changedAttributes();
          }
        }, this);
      };

      spyOn(FirstRequestLayout.prototype, 'fetchData');

      firstHandler = function(setLayoutData) {
        setLayoutData('key1', 'value1');
        setLayoutData({
          'key2': 'value2',
          'key3': 'value3'
        });

        return expectedView;
      };

      secondHandler = function(setLayoutData) {
        setLayoutData('key1', 'newValue1');

        return expectedView2;
      };
    });

    describe('layout data updating', function() {

      it('updates layout data with changed keys after first render completes', async function() {
        await execute(firstHandler);
        await execute(secondHandler);

        expect(layoutModelChanged).toEqual({
          'key1': 'newValue1',
          'key2': undefined,
          'key3': undefined
        });
      });

      it('does not update layout data when second handler starts before first render completes', async function() {
        await Promise.all([
          execute(firstHandler),
          execute(secondHandler),
        ]);

        expect(layoutModelChanged).toEqual(HASNT_CHANGED);
      });
    });

    describe('when second request wants to render with same layout that was used in first request', function() {

      it('does NOT fetch layout data for second request', async function() {
        await execute(firstHandler);

        expect(FirstRequestLayout.prototype.fetchData.calls.count()).toBe(1);

        await execute(secondHandler);

        expect(FirstRequestLayout.prototype.fetchData.calls.count()).toBe(1);
      });

      it('does NOT clean up layout when first request completes', async function() {
        await execute(firstHandler);
        await execute(secondHandler);

        expect(Layout.prototype.close).not.toHaveBeenCalled();
      });

      it('cleans up router for both requests', async function() {
        await itCleansUpRouterForBoth(firstHandler, secondHandler);
      });
    });

    describe('when second request renders with different layout than the layout for first request', function() {
      let secondRequestRouter;

      beforeEach(async function() {
        secondRequestRouter = makeFakeRouter('second_request', {
          layout: Layout.extend({
            template: 'second_request_layout',
            name: 'second_request_layout',
          }),
        });

        windough.location.pathname = '/second/route';
      });

      it('redirects to new route when user configures brisket to redirect on new layout', async function() {
        await execute(firstHandler);

        expect(windough.location.replace).not.toHaveBeenCalled();

        await executeWith({
          handler: secondHandler,
          router: secondRequestRouter,
        });

        expect(windough.location.replace).toHaveBeenCalledWith('/second/route');
      });

    });

  });

  describe('when original handler returns cancelled request', function() {

    describe('when readyState is 0', function() {
      let handler;

      beforeEach(function() {
        handler = function() {
          return Promise.reject({
            readyState: 0
          });
        };
      });

      it('should NOT render', async function() {
        await execute(handler);

        expect(ClientRenderer.render).not.toHaveBeenCalled();
      });

      it('does NOT clean up layout', async function() {
        await execute(handler);

        expect(Layout.prototype.close).not.toHaveBeenCalled();
      });

      it('cleans up router', async function() {
        await execute(handler);

        expect(firstRequestRouter.close).toHaveBeenCalled();
      });

    });

    describe('when statusCode is 0', function() {
      let handler;

      beforeEach(function() {
        handler = function() {
          return Promise.reject({
            status: 0
          });
        };
      });

      it('should NOT render when', async function() {
        await execute(handler);

        expect(ClientRenderer.render).not.toHaveBeenCalled();
      });

      it('does NOT clean up layout', async function() {
        await execute(handler);

        expect(Layout.prototype.close).not.toHaveBeenCalled();
      });

      it('cleans up router', async function() {
        await execute(handler);

        expect(firstRequestRouter.close).toHaveBeenCalled();
      });

    });

  });

  describe('when the first render request takes longer to return than the second', function() {
    const FIRST_HANDLER_MS = 10;
    const SECOND_HANDLER_MS = 5;

    let firstHandler;
    let secondHandler;

    describe('when both handlers are resolved', function() {
      let firstRouteOnComplete;
      let secondRouteOnComplete;

      beforeEach(function() {
        firstRouteOnComplete = jasmine.createSpy('first route on complete');
        secondRouteOnComplete = jasmine.createSpy('second route on complete');

        firstHandler = function(layout, request) {
          request.onComplete(firstRouteOnComplete);

          return resolvesWith(expectedView).inMs(FIRST_HANDLER_MS);
        };

        secondHandler = function(layout, request) {
          request.onComplete(secondRouteOnComplete);

          return resolvesWith(expectedView2).inMs(SECOND_HANDLER_MS);
        };
      });

      it('does NOT render the first request', async function() {
        await executeInParallel(firstHandler, secondHandler);

        expect(ClientRenderer.render).not.toHaveBeenCalledWith(
          jasmine.any(Layout),
          expectedView,
          jasmine.any(Number)
        );
      });

      it('does NOT run request.onComplete handler for first request', async function() {
        await executeInParallel(firstHandler, secondHandler);

        expect(firstRouteOnComplete).not.toHaveBeenCalled();
      });

      it('renders the latest request', async function() {
        await executeInParallel(firstHandler, secondHandler);

        expect(ClientRenderer.render).toHaveBeenCalledWith(
          jasmine.any(FirstRequestLayout),
          expectedView2,
          2
        );
      });

      it('runs request.onComplete handler for second request', async function() {
        await executeInParallel(firstHandler, secondHandler);

        expect(secondRouteOnComplete).toHaveBeenCalled();
      });

      it('cleans up router for both requests', async function() {
        await executeInParallel(firstHandler, secondHandler);

        expectRouterClosedTwice();
      });
    });

    describe('when first handler results in error view', function() {

      beforeEach(function() {
        firstHandler = function() {
          return rejectsWith({ status: 404 }).inMs(FIRST_HANDLER_MS);
        };

        secondHandler = function() {
          return resolvesWith(expectedView2).inMs(SECOND_HANDLER_MS);
        };
      });

      it('does NOT render the first request', async function() {
        await executeInParallel(firstHandler, secondHandler);

        expect(ClientRenderer.render).not.toHaveBeenCalledWith(
          jasmine.any(Layout),
          jasmine.any(PageNotFoundView),
          jasmine.any(Number)
        );
      });

      it('renders the latest request', async function() {
        await executeInParallel(firstHandler, secondHandler);

        expect(ClientRenderer.render).toHaveBeenCalledWith(
          jasmine.any(Layout),
          expectedView2,
          2
        );
      });

      it('cleans up router for both requests', async function() {
        await executeInParallel(firstHandler, secondHandler);

        expectRouterClosedTwice();
      });
    });

    describe('when second handler results in error view', function() {

      beforeEach(function() {
        firstHandler = function() {
          return resolvesWith(expectedView).inMs(FIRST_HANDLER_MS);
        };

        secondHandler = function() {
          return rejectsWith({ status: 404 }).inMs(SECOND_HANDLER_MS);
        };
      });

      it('does NOT render the first request', async function() {
        await executeInParallel(firstHandler, secondHandler);

        expect(ClientRenderer.render).not.toHaveBeenCalledWith(
          jasmine.any(Layout),
          expectedView,
          jasmine.any(Number)
        );
      });

      it('renders the latest request', async function() {
        await executeInParallel(firstHandler, secondHandler);

        expect(ClientRenderer.render).toHaveBeenCalledWith(
          jasmine.any(FirstRequestLayout),
          jasmine.any(PageNotFoundView),
          2
        );
      });

      it('cleans up router for both requests', async function() {
        await executeInParallel(firstHandler, secondHandler);

        expectRouterClosedTwice();
      });
    });

    describe('when both handlers result in error view', function() {

      beforeEach(function() {
        firstHandler = function() {
          return rejectsWith({ status: 500 }).inMs(FIRST_HANDLER_MS);
        };

        secondHandler = function() {
          return rejectsWith({ status: 404 }).inMs(SECOND_HANDLER_MS);
        };
      });

      it('does NOT render the first request', async function() {
        await executeInParallel(firstHandler, secondHandler);

        expect(ClientRenderer.render).not.toHaveBeenCalledWith(
          jasmine.any(Layout),
          jasmine.any(ErrorView),
          jasmine.any(Number)
        );
      });

      it('renders the latest request', async function() {
        await executeInParallel(firstHandler, secondHandler);

        expect(ClientRenderer.render).toHaveBeenCalledWith(
          jasmine.any(Layout),
          jasmine.any(PageNotFoundView),
          2
        );
      });

      it('cleans up router for both requests', async function() {
        await executeInParallel(firstHandler, secondHandler);

        expectRouterClosedTwice();
      });
    });

  });

  describe('route start and end hooks', function() {
    let firstHandler;
    let secondHandler;

    beforeEach(function() {
      firstHandler = function() {
        return resolvesWith(expectedView).inMs(5);
      };
    });

    describe('when route starts', function() {

      it('fires the onRouteStart callback', async function() {
        await execute(firstHandler);

        expect(firstRequestRouter.onRouteStart).toHaveBeenCalledWith(
          jasmine.any(Function),
          mockClientRequest,
          mockClientResponse
        );
      });

    });

    describe('when route ends', function() {

      it('fires the onRouteComplete handler from the router', async function() {
        await execute(firstHandler);

        expect(firstRequestRouter.onRouteComplete).toHaveBeenCalledWith(
          jasmine.any(Function),
          mockClientRequest,
          mockClientResponse
        );
      });

    });

    describe('when the first request takes longer than the second', function() {

      beforeEach(function() {
        secondHandler = function() {
          return resolvesWith(expectedView).inMs(2);
        };
      });

      it('only fires onRouteComplete for second request', async function() {
        await executeInParallel(firstHandler, secondHandler);

        const onCompleteCalls = firstRequestRouter.onRouteComplete.calls;

        expect(firstRequestRouter.onRouteComplete).toHaveBeenCalledWith(
          jasmine.any(Function),
          mockClientRequest,
          mockClientResponse
        );
        expect(onCompleteCalls.count()).toBe(1);
        expect(onCompleteCalls.mostRecent().args[1]).toEqual(jasmine.objectContaining({ requestId: 2}));
      });

    });

  });

  describe('when onRouteComplete callback errors', function() {
    let handler;

    beforeEach(function() {
      error = new Error('onRouteComplete callback error');

      firstRequestRouter.onRouteComplete.and.callFake(function() {
        throw error;
      });

      handler = SIMPLE_HANDLER;
    });

    it('notifies about error', async function() {
      await itNotifiesAboutErrorWhen(handler);
    });

    it('rethrows error', async function() {
      await itRethrowsErrorWhen(handler);
    });
  });

  describe('when request.onComplete callback errors', function() {
    let handler;

    beforeEach(function() {
      error = new Error('request.onComplete callback error');

      handler = function(layout, request) {
        request.onComplete(function() {
          throw error;
        });

        return expectedView;
      };
    });

    it('notifies about error', async function() {
      await itNotifiesAboutErrorWhen(handler);
    });

    it('rethrows error', async function() {
      await itRethrowsErrorWhen(handler);
    });
  });

  describe('when router errors on close', function() {
    let handler;

    beforeEach(function() {
      error = new Error('router close error');

      firstRequestRouter.close.and.callFake(function() {
        throw error;
      });

      handler = SIMPLE_HANDLER;
    });

    it('notifies about error', async function() {
      await itNotifiesAboutErrorWhen(handler);
    });

    it('rethrows error', async function() {
      await itRethrowsErrorWhen(handler);
    });
  });

  describe('when router doesn\'t have errorViewMapping and there is an error', function() {
    let handler;

    beforeEach(function() {
      firstRequestRouter.errorViewMapping = null;
      error = new Error('random error');

      handler = function() {
        return Promise.reject(error);
      };
    });

    it('notifies about error', async function() {
      await itNotifiesAboutErrorWhen(handler);
    });

    it('rethrows error', async function() {
      await itRethrowsErrorWhen(handler);
    });
  });

  async function itNotifiesAboutErrorWhen(handler) {
    let reason;

    try {
      await execute(handler);
    } catch (e) {
      expect(Errors.notify).toHaveBeenCalledWith(
        error,
        mockClientRequest
      );

      reason = e;
    }

    expect(reason).toBeDefined('[itNotifiesAboutErrorWhen] Expected error to be rethrown');
  }

  async function itDoesNotRethrowErrorWhen(handler) {
    await execute(handler);

    expect(true).toBe(true);
  }

  async function itRethrowsErrorWhen(handler) {
    let reason;

    try {
      await execute(handler);
    } catch (e) {
      reason = e;
    }

    expect(reason).toBeDefined('[itRethrowsErrorWhen] Expected error to be rethrown');
  }

  async function itCleansUpRouterWhen(handler) {
    await execute(handler);

    expect(firstRequestRouter.close).toHaveBeenCalled();
  }

  async function itCleansUpRouterForBoth(firstHandler, secondHandler) {
    await execute(firstHandler);
    await execute(secondHandler);

    expectRouterClosedTwice();
  }

  function expectRouterClosedTwice() {
    expect(firstRequestRouter.close.calls.count()).toBe(2);
  }

  async function itUnbindsRequestOnCompleteHandlersWhen(handler) {
    await execute(handler);

    expect(mockClientRequest.off).toHaveBeenCalled();
  }

  function expectRenderFor(view) {
    expect(ClientRenderer.render).toHaveBeenCalledWith(
      jasmine.any(Layout),
      view,
      1
    );
  }

  function expectNotToRender(view) {
    expect(ClientRenderer.render).not.toHaveBeenCalledWith(
      jasmine.any(Layout),
      view,
      1
    );
  }

  function executeInParallel(handler1, handler2) {
    return Promise.all([
      execute(handler1),
      execute(handler2),
    ]);
  }

  function execute(handler) {
    return executeWith({ handler, router: firstRequestRouter });
  }

  function executeWith({ handler, router, args = []}) {
    expect(handler).toBeDefined('[executeWith] Expected handler passed to "execute" to be defined');

    const argsForBackbone = args.concat(null);

    return ClientRenderingWorkflow.execute(router, handler, argsForBackbone, windough);
  }

  function makeFakeRouter(name, overrides = {}) {
    const fakeRouter = {
      layout: FirstRequestLayout,
      errorViewMapping: {
        404: PageNotFoundView,
        500: ErrorView
      },
      otherMethod: jasmine.createSpy(`fake router ${name}: other method`),
      onRouteStart: jasmine.createSpy(`fake router ${name}: on route start`),
      onRouteComplete: jasmine.createSpy(`fake router ${name}: on route complete`),
      close: jasmine.createSpy(`fake router ${name}: close`),
    };

    return {
      ...fakeRouter,
      ...overrides,
    }
  }

});

