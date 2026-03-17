import Router from '../../../lib/controlling/Router.js';
import ServerDispatcher from '../../../lib/server/ServerDispatcher.js';
import ServerRenderingWorkflow from '../../../lib/server/ServerRenderingWorkflow.js';

describe('Routing on server', function() {

  let mockRequest;
  let mockEnvironmentConfig;
  let routeHandler;
  let ExampleRouter;
  let router;
  let handledRoute;

  beforeEach(function() {
    spyOn(ServerRenderingWorkflow, 'execute').and.returnValue({
      html: 'content'
    });

    mockRequest = {};
    mockEnvironmentConfig = {};

    routeHandler = function() {};

    ExampleRouter = Router.extend({
      routes: {
        'route/:param': 'routeHandler'
      },

      routeHandler
    });

    router = new ExampleRouter();
  });

  afterEach(function() {
    ServerDispatcher.reset();
  });

  describe('when route exists, ServerDispatcher', function() {

    beforeEach(function() {
      handledRoute = ServerDispatcher.dispatch(
        'route/1',
        mockRequest,
        mockEnvironmentConfig
      );
    });

    it('executes the matched handler with params', function() {
      // the extra null parameter is passed by Backbone v1.1.2+
      const expectedParams = ['1', null];

      expect(ServerRenderingWorkflow.execute).toHaveBeenCalledWith(
        router,
        routeHandler,
        expectedParams,
        mockRequest,
        mockEnvironmentConfig
      );
    });

    it('returns a descriptor', function() {
      expect(handledRoute).toEqual(jasmine.objectContaining({
        content: {
          html: 'content'
        }
      }));
    });

  });

  describe('when route does NOT exist, ServerDispatcher', function() {

    beforeEach(function() {
      handledRoute = ServerDispatcher.dispatch(
        'notroute',
        mockRequest,
        mockEnvironmentConfig
      );
    });

    it('does NOT execute a handler', function() {
      expect(ServerRenderingWorkflow.execute).not.toHaveBeenCalled();
    });

    it('returns null', function() {
      expect(handledRoute).toBeNull();
    });

  });

});

