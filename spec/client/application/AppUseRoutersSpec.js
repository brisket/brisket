import App from '../../../lib/application/App.js';
import Backbone from '../../../lib/application/Backbone.js';

describe('Routers', function() {

  let CatchAllRouter;
  let Router1;
  let Router2;
  let orderRoutersInitialized;

  beforeEach(function() {
    orderRoutersInitialized = [];

    CatchAllRouter = Backbone.Router.extend({
      initialize() {
        orderRoutersInitialized.push('catch_all');
      }
    });
    Router1 = Backbone.Router.extend({
      initialize() {
        orderRoutersInitialized.push('router1');
      }
    });
    Router2 = Backbone.Router.extend({
      initialize() {
        orderRoutersInitialized.push('router2');
      }
    });
  });

  afterEach(function() {
    App.reset();
  });

  describe('#init', function() {

    describe('when catch all router is set', function() {

      beforeEach(function() {
        App.useRouters({
          CatchAllRouter,

          routers: [
            Router1,
            Router2
          ]
        });

        App.initialize();
      });

      it('initializes catch all router first', function() {
        expect(orderRoutersInitialized[0]).toBe('catch_all');
      });

    });

    describe('when no catch all router is set', function() {

      beforeEach(function() {
        App.useRouters({
          routers: [
            Router1,
            Router2,
            CatchAllRouter
          ]
        });
      });

      it('does NOT throw an error', function() {
        const initializingRoutersWithoutCatchAll = function() {
          App.initialize();
        };

        expect(initializingRoutersWithoutCatchAll).not.toThrow();
      });

    });

  });

});

