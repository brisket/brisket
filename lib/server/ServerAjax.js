import _ from 'underscore';
import qs from 'qs';
import axios from 'axios';
import Backbone from '../application/Backbone.js';
import AjaxCallsForCurrentRequest from './AjaxCallsForCurrentRequest.js';
import pathJoin from '../util/pathJoin.js';
import noop from '../util/noop.js';

const originalAjax = Backbone.ajax;

const ServerAjax = {

  setup(apis) {
    const availableApis = specificityOrderedApis(apis);

    Backbone.ajax = function(options) {
      const originalUrl = options.url;
      const queryParams = options.data;
      const method = options.type ? options.type.toLowerCase() : 'get';
      const headers = options.headers || {};
      const ajaxSuccessCallback = options.success || noop;
      const ajaxErrorCallback = options.error || noop;

      const apiAlias = mostSpecificApiMatch(availableApis, originalUrl);
      const apiConfig = apis[apiAlias];

      if (!apiConfig) {
        throw new Error(`You did not specify an api that matches the requested url: ${originalUrl}`);
      }

      const apiPath = originalUrl.replace(`${apiAlias}/`, '');
      const url = pathJoin(apiConfig.host, apiPath);

      const proxy = apiConfig.proxy;
      const timeout = apiConfig.timeout || null;

      const requestOptions = {
        url,
        method,
        headers,
        timeout,
      };

      if (!_.isUndefined(queryParams)) {
        requestOptions.params = queryParams;
        requestOptions.paramsSerializer = function(params) {
          return qs.stringify(params, { arrayFormat: 'brackets' });
        };
      }

      if (!_.isUndefined(proxy)) {
        requestOptions.proxy = proxy;
      }

      return axios(requestOptions)
        // catch and handle request errors separately from user land code errors
        .catch(function(error) {
          let status = 500;
          let xhr, errorThrown;

          if (error.response) {
            status = error.response.status;
            errorThrown = ajaxError(status);

            xhr = makeXhr(url, proxy, status, error.response.data);
          } else {
            errorThrown = noResponseError(error.request || error.message);

            xhr = makeXhr(url, proxy, status, null);
          }

          ajaxErrorCallback(xhr, status, errorThrown);

          throw xhr;
        })
        .then(function(response) {
          const data = response.data;

          ajaxSuccessCallback(data);

          AjaxCallsForCurrentRequest.record(originalUrl, queryParams, data);

          return data;
        });
    };
  },

  reset() {
    Backbone.ajax = originalAjax;
    AjaxCallsForCurrentRequest.clear();
  }

};

function makeXhr(url, proxy = null, status, response) {
  return {
    proxy,
    status,
    url,
    response
  };
}

function ajaxError(status) {
  return new Error(`Server responded with a status of ${status}`);
}

function noResponseError(error) {
  return new Error('Did not get a response from server. Error was:', error);
}

function specificityOrderedApis(apis) {
  return Object.keys(apis).sort(function(a, b) {
    return a.length < b.length;
  });
}

function mostSpecificApiMatch(availableApis, originalUrl) {
  for (let i = 0; i < availableApis.length; i++) {
    if (originalUrl.match(new RegExp(`^/?${availableApis[i]}`))) {
      return availableApis[i];
    }
  }
}

export default ServerAjax;

