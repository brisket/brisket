import qs from 'qs';
import cookie from 'cookie';
import _ from 'underscore';
import constructQualifiedUrl from '../util/constructQualifiedUrl.js';
import Cookies from '../cookies/Cookies.js';
import Backbone from '../application/Backbone.js';

let previousRequest;
let previousCookies;
let cachedParsedCookies;
let fromLinkClick = false;

const LENGTH_OF_LEADING_SLASH = '/'.length;
const COMPLETE_EVENT = 'complete';

const ClientRequest = {

  from(windough, requestId, environmentConfig) {
    environmentConfig = environmentConfig || {};

    const protocol = windough.location.protocol;
    const querystring = windough.location.search.substr(1);
    const isFirstRequest = requestId < 2;
    const windowPath = windough.location.pathname;
    const appRoot = environmentConfig.appRoot || '';
    let events;

    return {
      host: windough.location.host,
      hostname: windough.location.hostname,
      path: windowPath,
      applicationPath: windowPath.substring(appRoot.length + LENGTH_OF_LEADING_SLASH),
      protocol: protocol.substring(0, protocol.length - 1),
      query: qs.parse(querystring),
      rawQuery: querystring,
      referrer: getReferrerFromPreviousRequest() || windough.document.referrer,
      userAgent: windough.navigator.userAgent,
      isFirstRequest: requestId < 2,
      requestId,
      isNotClick: !isFirstRequest && notFromLinkClick(),
      environmentConfig,
      cookies: calculateCookiesFrom(windough, environmentConfig),
      onComplete(doSomething) {
        if (!events) {
          events = _.clone(Backbone.Events);
        }

        events.once(COMPLETE_EVENT, doSomething);
      },
      complete() {
        if (!events) {
          return;
        }

        events.trigger(COMPLETE_EVENT);
      },
      off() {
        if (!events) {
          return;
        }

        events.off(COMPLETE_EVENT);
      }
    };
  },

  setPreviousRequest(request) {
    previousRequest = request;
  },

  isFromLinkClick() {
    fromLinkClick = true;
  },

  reset() {
    previousRequest = null;
    fromLinkClick = false;
    previousCookies = null;
    cachedParsedCookies = null;
  }

};

function getReferrerFromPreviousRequest() {
  if (!previousRequest) {
    return null;
  }

  return constructQualifiedUrl(previousRequest);
}

function notFromLinkClick() {
  const couldBeBack = !fromLinkClick;

  fromLinkClick = false;

  return couldBeBack;
}

function calculateCookiesFrom(windough, environmentConfig) {
  if (!Cookies.areAvailable(environmentConfig)) {
    return null;
  }

  const currentCookies = windough.document.cookie;

  if (currentCookies === previousCookies) {
    return cachedParsedCookies;
  }

  previousCookies = currentCookies;
  cachedParsedCookies = cookie.parse(currentCookies);

  return cachedParsedCookies;
}

export default ClientRequest;

