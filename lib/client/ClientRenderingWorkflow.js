import ClientRenderer from './ClientRenderer.js';
import ClientRequest from './ClientRequest.js';
import ClientResponse from './ClientResponse.js';
import ErrorPage from '../errors/ErrorPage.js';
import Errors from '../errors/Errors.js';
import addExtraParamsTo from '../util/addExtraParamsTo.js';
import validateView from '../util/validateView.js';
import Response from '../controlling/Response.js';
import Backbone from '../application/Backbone.js';
import setKeys from '../util/setKeys.js';
import { default as promisifyMaker } from '../util/promisify.js';

const promisify = promisifyMaker(Promise);

let currentRequestId = 0;
let currentLayout;
let whenLayoutDataFetched;
let environmentConfig = {};

const ClientRenderingWorkflow = {

  execute(router, originalHandler, params, windough) {
    windough = windough || window;
    currentRequestId = currentRequestId + 1;

    const clientRequest = ClientRequest.from(windough, currentRequestId, environmentConfig);
    const clientResponse = ClientResponse.from(windough);

    const LayoutForRoute = router.layout;
    const errorViewMapping = router.errorViewMapping;
    const onRouteStart = router.onRouteStart;
    const onRouteComplete = router.onRouteComplete;

    const isFirstPageLoad = !currentLayout;
    const layoutForRouteIsDifferentFromCurrent = !isFirstPageLoad && !currentLayout.isSameTypeAs(LayoutForRoute);

    if (layoutForRouteIsDifferentFromCurrent) {
      windough.location.replace(
        Response.redirectDestinationFrom(clientRequest.applicationPath)
      );
      return;
    }

    let layout = currentLayout;
    const recordedState = layout ? clear(layout.model.toJSON()) : {};

    let recording = true;

    function setLayoutData(key, value) {
      if (recording) {
        setKeys(recordedState, key, value);
        return;
      }

      layout.model.set(key, value);
    }

    // If handler returns a view, this function returns a promise of a view
    // If handler returns a promise of a view, this function returns a promise of a view
    // and absorbs the state of the returned promise
    function chooseViewForRoute() {
      const allParams = addExtraParamsTo(params,
        setLayoutData,
        clientRequest,
        clientResponse
      );

      return promisify(originalHandler).apply(router, allParams)
        .then(function(view) {
          validateView(view);

          return {
            view,
            reason: null
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
      if (!isFirstPageLoad) {
        return workflowState;
      }

      const stateForLayout = workflowState.reason ? {} : recordedState;

      stateForLayout['environmentConfig'] = environmentConfig;

      layout = new LayoutForRoute({
        model: new Backbone.Model(stateForLayout)
      });

      currentLayout = layout;

      return workflowState;
    }

    function fetchLayoutData(workflowState) {
      if (!whenLayoutDataFetched) {
        whenLayoutDataFetched = promisify(layout.fetchData).call(layout);
      }

      return whenLayoutDataFetched
        .then(function() {
          return workflowState;
        })
        .catch(function(reason) {
          if (isFirstPageLoad) {
            workflowState.reason = workflowState.reason || reason;
          }

          return workflowState;
        });
    }

    function renderLayout() {
      if (layout.hasBeenRendered) {
        return;
      }

      layout.reattach();
      layout.render();
    }

    function updateLayoutData(requestId) {
      if (!isCurrentRequest(requestId)) {
        return;
      }

      if (!isFirstPageLoad) {
        layout.model.set(recordedState);
      }

      recording = false;
    }

    function enterDOM(view) {
      if (isFirstPageLoad) {
        layout.enterDOM();
      }

      return view;
    }

    function close(requestId) {
      if (isCurrentRequest(requestId)) {
        onRouteComplete(setLayoutData, clientRequest, clientResponse);
        clientRequest.complete();
        ClientRequest.setPreviousRequest(clientRequest);
      }

      clientRequest.off();

      router.close();
    }

    return (function(requestId) {

      onRouteStart(setLayoutData, clientRequest, clientResponse);

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

          if (reason === ClientResponse.INTERRUPT_RENDERING) {
            return;
          }

          renderLayout();

          if (reason) {
            throw reason;
          }

          updateLayoutData(requestId);

          return renderView(view, layout, requestId);
        })['catch'](function(reason) {
          return logAndRenderError(
            reason,
            layout,
            errorViewMapping,
            clientRequest,
            requestId
          );
        })['finally'](function() {
          try {
            enterDOM();
            return close(requestId);
          } catch (e) {
            Errors.notify(e, clientRequest);
            throw e;
          }
        });

    })(currentRequestId);
  },

  setEnvironmentConfig(newEnvironmentConfig) {
    environmentConfig = newEnvironmentConfig;
  },

  reset() {
    currentRequestId = 0;
    currentLayout = null;
    whenLayoutDataFetched = null;
    environmentConfig = {};
  }

};

function isCurrentRequest(requestId) {
  return requestId === currentRequestId;
}

function notCurrentRequest(requestId) {
  return requestId !== currentRequestId;
}

function isACanceledRequest(jqxhr) {
  if (jqxhr && (jqxhr.readyState === 0 || jqxhr.status === 0)) {
    return true;
  }

  return false;
}

function render(layout, view, requestId) {
  return ClientRenderer.render(layout, view, requestId);
}

function renderView(view, layout, requestId) {
  if (notCurrentRequest(requestId)) {
    return;
  }

  return render(layout, view, requestId);
}

function logAndRenderError(reason, layout, errorViewMapping, clientRequest, requestId) {
  Errors.notify(reason, clientRequest);

  if (notCurrentRequest(requestId)) {
    return;
  }

  if (isACanceledRequest(reason)) {
    return;
  }

  layout.model.set(clear(layout.model.toJSON()), {
    silent: requestId === 1
  });

  layout.clearContent();

  const ErrorView = ErrorPage.viewFor(errorViewMapping, reason.status);

  if (!ErrorView) {
    throw reason;
  }

  return render(layout, new ErrorView(), requestId);
}

function clear(state) {
  const keys = Object.keys(state);
  const clearedState = {};

  for (let i = keys.length - 1; i >= 0; i--) {
    if (keys[i] === 'environmentConfig') {
      continue;
    }

    clearedState[keys[i]] = void 0;
  }

  return clearedState;
}

export default ClientRenderingWorkflow;

