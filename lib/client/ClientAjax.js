import _ from 'underscore';
import Backbone from '../application/Backbone.js';
import BootstrappedDataService from './BootstrappedDataService.js';
import ClientTestable from './ClientTestable.js';
import pathJoin from '../util/pathJoin.js';

const originalAjax = Backbone.ajax;

const ClientAjax = {

  setup(bootstrappedData, appRoot) {
    ClientTestable.BackboneNativeAjax.Promise = Promise;

    BootstrappedDataService.load(bootstrappedData);

    Backbone.ajax = function(ajaxConfig) {
      const dataInBootstrappedData = BootstrappedDataService.getFor(ajaxConfig);
      let bubbledError;

      function bubbleErrorFrom(prop) {
        const callback = ajaxConfig[prop];

        if (!_.isFunction(callback)) {
          return;
        }

        ajaxConfig[prop] = function() {
          try {
            return callback.apply(null, arguments);
          } catch (e) {
            bubbledError = e;
          }
        };
      }

      bubbleErrorFrom('success');

      if (dataInBootstrappedData) {
        if (_.isFunction(ajaxConfig.success)) {
          ajaxConfig.success(dataInBootstrappedData);
        }

        if (bubbledError) {
          return Promise.reject(bubbledError);
        }

        return Promise.resolve(dataInBootstrappedData);
      }

      bubbleErrorFrom('error');

      ajaxConfig.url = pathJoin(appRoot, ajaxConfig.url);

      return ClientTestable.BackboneNativeAjax(ajaxConfig)['finally'](function(data) {
        if (bubbledError) {
          throw bubbledError;
        }

        return data;
      });
    };
  },

  reset() {
    Backbone.ajax = originalAjax;
  }

};

export default ClientAjax;
