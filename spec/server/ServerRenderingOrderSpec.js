import ServerRenderingWorkflow from '../../lib/server/ServerRenderingWorkflow.js';
import View from '../../lib/viewing/View.js';
import MockExpressRequest from '../mock/MockExpressRequest.js';
import MockRouter from '../mock/MockRouter.js';

describe('Server side rendering order', function() {

  let renderingOrder;
  let expectedView;
  let originalHandler;
  let mockRouter;

  beforeEach(function() {
    expectedView = newExpectedView();
    renderingOrder = [];

    mockRouter = MockRouter.create();

    spyRenderingFor(mockRouter);

    originalHandler = function(setLayoutData) {
      renderingOrder.push('route handler runs');

      setLayoutData('custom', 'data');

      return expectedView;
    };

  });

  it('maintains a predictable rendering lifecycle for layout AND view on first request', function(done) {
    runRequest().finally(function() {
      expect(renderingOrder).toEqual([
        'route handler runs',
        'layout fetches data',
        'layout renders',
        'view for route renders'
      ]);

      done();
    });
  });

  function runRequest() {
    return ServerRenderingWorkflow.execute(
      mockRouter,
      originalHandler, [null],
      MockExpressRequest.basic(), {}
    );
  }

  function spyRenderingFor(router) {
    spyOn(router.layout.prototype, 'fetchData').and.callFake(function() {
      renderingOrder.push('layout fetches data');
    });

    const originalLayoutRender = router.layout.prototype.render;

    spyOn(router.layout.prototype, 'render').and.callFake(function() {
      renderingOrder.push('layout renders');

      originalLayoutRender.apply(this, arguments);
    });

    spyOn(router.layout.prototype, 'onDOM').and.callFake(function() {
      renderingOrder.push('layout enters DOM');

      this.isInDOM = true;
    });
  }

  function newExpectedView() {
    const view = new View();

    spyOn(view, 'render').and.callFake(function() {
      renderingOrder.push('view for route renders');

      return this;
    });

    spyOn(view, 'onDOM').and.callFake(function() {
      renderingOrder.push('view for route enters DOM');
    });

    return view;
  }

});
