import _ from 'underscore';
import axios from 'axios';
import Errors from '../errors/Errors.js';

const ForwardClientRequest = {

  toApi(apiConfig, apiAlias) {
    return async function(req, res) {
      const options = {
        method: req.method.toLowerCase(),
        url: apiConfig.host + req.url,
        timeout: apiConfig.timeout || null,
      };

      if (!_.isUndefined(apiConfig.proxy)) {
        options.proxy = apiConfig.proxy;
      }

      let status, data, headers;

      try {
        const response = await axios(options);
        status = response.status;
        data = response.data;
        headers = response.headers;
      } catch (error) {
        if (error.response) {
          status = error.response.status;
          data = error.response.data;
          headers = error.response.headers;

          Errors.notify({
            error,
            type: Errors.API_ERROR,
            detail: {
              url: options.url,
              proxy: options.proxy,
              apiAlias
            }
          }, req);
        } else if (error.request) {
          Errors.notify(error.request, req);
        } else {
          Errors.notify(error.message, req);
        }
      } finally {
        if (headers) {
          res.set(headers);
        }

        res.status(status || 500).send(data);
      }
    };
  }

};

export default ForwardClientRequest;

