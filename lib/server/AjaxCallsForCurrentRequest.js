import DomainLocalStorage from './DomainLocalStorage.js';
import BootstrappedDataService from '../client/BootstrappedDataService.js';

const RECORDED_AJAX_CALLS = 'recordedAjaxCalls';

const AjaxCallsForCurrentRequest = {

  record(url, queryParams, data) {
    const recordedAjaxCalls = DomainLocalStorage.get(RECORDED_AJAX_CALLS) || {};
    const key = BootstrappedDataService.computeKey(url, queryParams);

    recordedAjaxCalls[key] = data;

    DomainLocalStorage.set(RECORDED_AJAX_CALLS, recordedAjaxCalls);
  },

  all() {
    return DomainLocalStorage.get(RECORDED_AJAX_CALLS);
  },

  clear() {
    DomainLocalStorage.set(RECORDED_AJAX_CALLS, null);
  }

};

export default AjaxCallsForCurrentRequest;

