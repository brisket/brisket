import _ from 'underscore';
import axios from 'axios';
import Server from '../../lib/server/Server.js';
import ServerResponseWorkflow from '../../lib/server/ServerResponseWorkflow.js';
import ServerDispatcher from '../../lib/server/ServerDispatcher.js';
import ServerInitializer from '../../lib/server/ServerInitializer.js';
import App from '../../lib/application/App.js';
import ForwardClientRequest from '../../lib/server/ForwardClientRequest.js';

describe('Server', function() {

  beforeEach(function() {
    spyOn(ServerInitializer, 'forApp');
  });

  afterEach(function() {
    App.reset();
  });

  describe('#create', function() {

    it('initializes server and initializes App', function() {
      Server.create(validConfig());

      expect(ServerInitializer.forApp).toHaveBeenCalled();
      expect(ServerInitializer.forApp.calls.count()).toBe(1);
    });

    it('sets axios adapter to "http"', function() {
      Server.create(validConfig());

      expect(axios.defaults.adapter).toBe('http');
    });

    it('adds a middleware for each api in apis configuration', function() {
      const apiMiddleware = jasmine.createSpy();
      const otherApiMiddleware = jasmine.createSpy();

      spyOn(ForwardClientRequest, 'toApi').and.callFake(function(apiConfig) {
        if (apiConfig.host === 'http://api.example.com') {
          return apiMiddleware;
        }

        if (apiConfig.host === 'http://other-api.example.com') {
          return otherApiMiddleware;
        }
      });

      const brisketEngine = Server.create(validConfig());

      expectMiddlewareFor(brisketEngine, 'api', apiMiddleware);
      expectMiddlewareFor(brisketEngine, 'other-api', otherApiMiddleware);
    });

  });

  describe('apis', function() {

    it('does NOT throw when all apis have host', function() {
      function creatingServerWithValidApis() {
        Server.create(validConfig());
      }

      expect(creatingServerWithValidApis).not.toThrow();
    });

    it('throws if any api alias does NOT have a valid config', function() {
      function creatingServerWithApiWithInvalidConfig() {
        Server.create(validConfigWith({
          apis: {
            'api': 'not a valid config'
          }
        }));
      }

      expect(creatingServerWithApiWithInvalidConfig).toThrow();
    });

    it('throws if any api alias does NOT have a valid host', function() {
      function creatingServerWithApiWithInvalidHost() {
        Server.create(validConfigWith({
          apis: {
            'api': {
              host: null
            }
          }
        }));
      }

      expect(creatingServerWithApiWithInvalidHost).toThrow();
    });

  });

  describe('environmentConfig', function() {
    let environmentConfig;

    function appRootWithTrailingSlash() {
      return Server.create(validConfigWith({
        environmentConfig: {
          appRoot: '/bad/'
        }
      }));
    }

    function appRootWithoutLeadingSlash() {
      return Server.create(validConfigWith({
        environmentConfig: {
          appRoot: 'bad'
        }
      }));
    }

    it('is passed to initializers start method', function() {
      environmentConfig = {
        some: 'data'
      };

      Server.create(validConfigWith({
        environmentConfig
      }));

      expect(objectPassedToInitializeAppOnServer().environmentConfig)
        .toEqual(environmentConfig);
    });

    it('throws an error when appRoot has trailing slash', function() {
      expect(appRootWithTrailingSlash).toThrow();
    });

    it('throws an error when appRoot is missing leading slash', function() {
      expect(appRootWithoutLeadingSlash).toThrow();
    });

  });

  describe('serverConfig', function() {
    let serverConfig;

    beforeEach(function() {
      serverConfig = {
        some: 'data'
      };

      Server.create(validConfigWith({
        serverConfig
      }));
    });

    it('it\'s properties are passed to server initializers start method', function() {
      expect(objectPassedToInitializeAppOnServer().serverConfig)
        .toHaveKeyValue('some', 'data');
    });

    it('exposes apis to server initializers through serverConfig', function() {
      expect(objectPassedToInitializeAppOnServer().serverConfig['apis']).toEqual({
        'api': {
          host: 'http://api.example.com'
        },
        'other-api': {
          host: 'http://other-api.example.com'
        }
      });
    });

  });

  describe('#sendResponseFromApp', function() {
    let middleware;
    let environmentConfig;
    let mockRequest;
    let mockResponse;
    let mockNext;
    let mockServerResponse;
    let mockCallback;

    beforeEach(function() {
      environmentConfig = {};
      middleware = Server.sendResponseFromApp(environmentConfig);

      mockRequest = {
        path: '/aRoute',
        headers: {
          host: 'http://www.example.com:8080'
        }
      };

      mockResponse = {};
      mockNext = jasmine.createSpy();

      spyOn(ServerDispatcher, 'dispatch');
      spyOn(ServerResponseWorkflow, 'sendResponseFor');
    });

    it('lets client app know when server does NOT have cookies', function() {
      middleware(mockRequest, mockResponse, mockNext);
      expect(environmentConfig['brisket:wantsCookies']).toBe(false);
    });

    it('lets client app know when server has cookies', function() {
      mockRequest.cookies = {};
      middleware(mockRequest, mockResponse, mockNext);
      expect(environmentConfig['brisket:wantsCookies']).toBe(true);
    });

    it('dispatches to server app with leading slash of request path stripped', function() {
      middleware(mockRequest, mockResponse, mockNext);
      expect(ServerDispatcher.dispatch.calls.mostRecent().args[0]).toBe('aRoute');
    });

    it('dispatches to server app with request host', function() {
      middleware(mockRequest, mockResponse, mockNext);
      expect(ServerDispatcher.dispatch.calls.mostRecent().args[1]).toBe(mockRequest);
    });

    it('dispatches to server app with client config', function() {
      middleware(mockRequest, mockResponse, mockNext);
      expect(ServerDispatcher.dispatch.calls.mostRecent().args[2]).toBe(environmentConfig);
    });

    describe('when app CANNOT handle a request', function() {

      beforeEach(function() {
        ServerDispatcher.dispatch.and.returnValue(null);
      });

      it('forwards onto next middleware', function() {
        middleware(mockRequest, mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalled();
      });

      it('does NOT send server app response', function() {
        middleware(mockRequest, mockResponse, mockNext);
        expect(ServerResponseWorkflow.sendResponseFor).not.toHaveBeenCalled();
      });

    });

    describe('when app CAN handle a request', function() {

      beforeEach(function() {
        ServerDispatcher.dispatch.and.returnValue({
          content: 'html'
        });
      });

      it('sends app response', function() {
        middleware(mockRequest, mockResponse, mockNext);
        expect(ServerResponseWorkflow.sendResponseFor)
          .toHaveBeenCalledWith('html', mockResponse, mockNext);
      });

    });

    describe('onRouteHandled', function() {

      beforeEach(function() {
        mockServerResponse = {
          content: 'html',
          handler: {
            rawRoute: 'rawRoute'
          }
        };

        ServerDispatcher.dispatch.and.returnValue(mockServerResponse);
      });

      describe('when a server response callback handler is passed in', function() {

        beforeEach(function() {
          mockCallback = jasmine.createSpy('mockCallback');

          middleware = Server.sendResponseFromApp(
            environmentConfig,
            mockCallback
          );

          middleware(mockRequest, mockResponse, mockNext);
        });

        it('fires the callback with the request and the actual route', function() {
          expect(mockCallback).toHaveBeenCalledWith({
            request: mockRequest,
            route: mockServerResponse.handler.rawRoute
          });
        });

      });

      describe('when NO server response callback handler is passed in', function() {

        beforeEach(function() {
          middleware = Server.sendResponseFromApp(
            environmentConfig,
            mockRequest.path,
            null
          );
        });

        it('doesn\'t not error out', function() {
          expect(function() {
            middleware(mockRequest, mockResponse, mockNext);
          }).not.toThrow();
        });

      });
    });

  });

  function validConfig() {
    return {
      apis: {
        'api': {
          host: 'http://api.example.com'
        },
        'other-api': {
          host: 'http://other-api.example.com'
        }
      }
    };
  }

  function validConfigWith(customSettings) {
    return _.extend(validConfig(), customSettings);
  }

  function objectPassedToInitializeAppOnServer() {
    return ServerInitializer.forApp.calls.mostRecent().args[0];
  }

  function expectMiddlewareFor(brisketEngine, api, middleware) {
    const expressLayers = brisketEngine.router.stack;
    const matched = {};

    for (let i = expressLayers.length - 1; i !== 0; i--) {
      const expressLayer = expressLayers[i];
      const matchers = expressLayer.matchers || [];

      if (matched[api]) {
        throw new Error(`expected ONLY 1 middleware for ${api} on brisketEngine`);
      }
      if (
        matchers.some(matcher => matcher(`/${api}/path/to/data`)) &&
        !matchers.some(matcher => matcher('anything else'))
      ) {
        matched[api] = true;
        expect(expressLayer.handle).toBe(middleware);
        return;
      }
    }

    throw new Error(`expected a middleware for ${api} on brisketEngine`);
  }

});

