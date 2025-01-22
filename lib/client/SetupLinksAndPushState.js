import Backbone from '../application/Backbone.js';
import Browser from './Browser.js';
import ClientRequest from './ClientRequest.js';
import isApplicationLink from '../controlling/isApplicationLink.js';
import isExternalLinkTarget from '../controlling/isExternalLinkTarget.js';

function isNotUsabilityClick(e) {
  /* wawjr3d
     * Ignore ctrl+click, alt+click, shift+click, meta+click
     * Ignore Firefox bubbles non-left button clicks (i.e. e.button > 0)
     */
  return !e.button && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;
}

function notLink(eventTarget) {
  return !eventTarget || eventTarget.nodeName !== 'A' || !eventTarget.hasAttribute('href');
}

function routeApplicationLink(e) {
  const eventTarget = e.target;

  if (notLink(eventTarget)) {
    return;
  }

  const link = eventTarget;
  const route = link.getAttribute('href');
  const target = link.getAttribute('target');

  if (!e.defaultPrevented &&
        !isExternalLinkTarget(target) &&
        isApplicationLink(route) &&
        isNotUsabilityClick(e)) {

    e.preventDefault();

    ClientRequest.isFromLinkClick();

    // Instruct Backbone to trigger routing events
    Backbone.history.navigate(route, {
      trigger: true
    });

    return false;
  }
}

function setupApplicationLinks() {
  document.addEventListener('click', routeApplicationLink);
}

function finishStartWithPushState() {
  setupApplicationLinks();
  Backbone.history.loadUrl(Backbone.history.getFragment());
}

function invalid(route) {
  return typeof route !== 'string';
}

function finishStartWithoutPushState(root) {
  return function() {
    const rootLength = root.length;
    const fragment = Browser.location().pathname.substr(rootLength);
    Backbone.history.loadUrl(fragment);
  };
}

let browserSupportsPushState = true;
let root = '';

const SetupLinksAndPushState = {

  start(requestedOptions) {
    const options = requestedOptions || {};

    if ('root' in options) {
      root = options.root;
    }

    if ('browserSupportsPushState' in options) {
      browserSupportsPushState = options.browserSupportsPushState;
    }

    Backbone.history.start({
      pushState: browserSupportsPushState,
      root,
      hashChange: false,
      silent: true
    });

    const finishStart = browserSupportsPushState ?
      finishStartWithPushState : finishStartWithoutPushState(root);

    finishStart();
  },

  stop() {
    Backbone.history.stop();
    document.removeEventListener('click', routeApplicationLink);
  },

  navigateTo(route) {
    if (invalid(route)) {
      return;
    }

    Backbone.history.navigate(route, {
      trigger: true
    });
  },

  replacePath(route) {
    if (!browserSupportsPushState || invalid(route)) {
      return;
    }

    Backbone.history.navigate(route, {
      replace: true
    });
  },

  changePath(route) {
    if (!browserSupportsPushState || invalid(route)) {
      return;
    }

    Backbone.history.navigate(route);
  },

  reloadRoute() {
    Backbone.history.loadUrl();
  }

};

export default SetupLinksAndPushState;

