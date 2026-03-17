import ClientRenderingWorkflow from '../../../lib/client/ClientRenderingWorkflow.js';
import View from '../../../lib/viewing/View.js';
import MockRouter from '../../mock/MockRouter.js';

describe('Client side rendering order', function() {

  let renderingOrder;
  let expectedView;
  let originalHandler;
  let mockRouter;

  beforeEach(function() {
    ClientRenderingWorkflow.reset();

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

  afterEach(function() {
    ClientRenderingWorkflow.reset();
  });

  it('maintains a predictable rendering lifecycle for layout AND view on first request', async function() {
    try {
      await runFirstRequest();
    } finally {
      expect(renderingOrder).toEqual([
        'route handler runs',
        'layout fetches data',
        'layout reattaches',
        'layout renders',
        'view for route renders',
        'layout enters DOM',
        'view for route enters DOM',
      ]);
    }
  });

  it('maintains a predictable rendering lifecycle for layout ' +
        'AND view on all other requests when layout does NOT change',
  async function() {
    try {
      await runAnotherRequest();
    } finally {
      expect(renderingOrder).toEqual([
        'route handler runs',
        'view for route renders',
        'view for route enters DOM',
      ]);
    }
  });

  function runRequest(router) {
    return ClientRenderingWorkflow.execute(router, originalHandler, []);
  }

  function runFirstRequest() {
    return runRequest(mockRouter);
  }

  function runAnotherRequest() {
    return runRequest(mockRouter).then(function() {
      renderingOrder = [];
      expectedView = newExpectedView();

      return runRequest(mockRouter);
    });
  }

  function spyRenderingFor(router) {
    spyOn(router.layout.prototype, 'fetchData').and.callFake(function() {
      renderingOrder.push('layout fetches data');
    });

    spyOn(router.layout.prototype, 'reattach').and.callFake(function() {
      renderingOrder.push('layout reattaches');
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
