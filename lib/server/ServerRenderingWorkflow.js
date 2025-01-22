import ServerRenderer from './ServerRenderer.js';
import ServerRequest from './ServerRequest.js';
import ServerResponse from './ServerResponse.js';
import ErrorPage from '../errors/ErrorPage.js';
import Errors from '../errors/Errors.js';
import addExtraParamsTo from '../util/addExtraParamsTo.js';
import AjaxCallsForCurrentRequest from './AjaxCallsForCurrentRequest.js';
import validateView from '../util/validateView.js';
import Backbone from '../application/Backbone.js';
import setKeys from '../util/setKeys.js';
import { default as promisifyMaker } from '../util/promisify.js';

const promisify = promisifyMaker(Promise);

const ServerRenderingWorkflow = {

  execute(router, originalHandler, params, expressRequest, environmentConfig) {
    const serverRequest = ServerRequest.from(expressRequest, environmentConfig);
    const serverResponse = ServerResponse.create();

    const LayoutForRoute = router.layout;
    const errorViewMapping = router.errorViewMapping;

    const recordedState = {};

    function setLayoutData(key, value) {
      setKeys(recordedState, key, value);
    }

    let layout;

    // If handler returns a view, this function returns a promise of a view
    // If handler returns a promise of a view, this function returns a promise of a view
    // and absorbs the state of the returned promise
    function chooseViewForRoute() {
      const allParams = addExtraParamsTo(params,
        setLayoutData,
        serverRequest,
        serverResponse
      );

      return promisify(originalHandler).apply(router, allParams)
        .then(function(view) {
          validateView(view);

          return {
            view,
            reason: null,
          };
        })
        .catch(function(reason) {
          return {
            view: null,
            reason
          };
        });
    }

    function initializeLayout(workflowState) {
      const stateForLayout = workflowState.reason ? {} : recordedState;

      stateForLayout['environmentConfig'] = environmentConfig;

      try {
        layout = new LayoutForRoute({
          model: new Backbone.Model(stateForLayout)
        });
      } catch (reason) {
        workflowState.reason = reason;

        layout = new LayoutForRoute({
          model: new Backbone.Model({
            environmentConfig
          })
        });
      }

      return workflowState;
    }

    function fetchLayoutData(workflowState) {
      return promisify(layout.fetchData).call(layout)
        .then(function() {
          return workflowState;
        })
        .catch(function(reason) {
          workflowState.reason = workflowState.reason || reason;

          return workflowState;
        });
    }

    function close() {
      if (layout) {
        layout.close();
      }
      router.close();
      AjaxCallsForCurrentRequest.clear();
    }

    const forRoute = {
      environmentConfig,
      expressRequest,
      serverRequest,
      serverResponse,
      errorViewMapping
    };

    return chooseViewForRoute()
      .then(
        initializeLayout
      )
      .then(
        fetchLayoutData
      )
      .then(function(workflowState) {
        const view = workflowState.view;
        const reason = workflowState.reason;

        if (reason === ServerResponse.INTERRUPT_RENDERING) {
          return {
            html: null,
            serverResponse
          };
        }

        layout.render();

        if (reason) {
          throw reason;
        }

        return {
          html: renderPage(view, layout, forRoute),
          serverResponse
        };
      })['catch'](function(reason) {
        return logAndRenderError(reason, layout, forRoute);
      })['finally'](function() {
        try {
          return close();
        } catch (e) {
          Errors.notify(e, expressRequest);
          throw e;
        }
      });
  }

};

function renderPage(view, layout, forRoute) {
  return ServerRenderer.render(
    layout,
    view,
    forRoute.environmentConfig,
    forRoute.serverRequest
  );
}

function logAndRenderError(reason, layout, forRoute) {
  const serverResponse = forRoute.serverResponse;
  const errorViewMapping = forRoute.errorViewMapping;

  Errors.notify(reason, forRoute.expressRequest);

  const ErrorView = ErrorPage.viewFor(errorViewMapping, reason.status);

  if (!ErrorView || !layout) {
    throw reason;
  }

  const status = ErrorPage.getStatus(errorViewMapping, reason.status);

  serverResponse.status(status);
  serverResponse.fail();

  layout.model.clear({
    silent: true
  });

  if (!layout.hasBeenRendered) {
    layout.render();
  }

  layout.clearContent();

  return {
    html: renderPage(new ErrorView(), layout, forRoute),
    serverResponse
  };
}

export default ServerRenderingWorkflow;

