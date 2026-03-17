let bootstrappedData;
let bootstrappedFieldsRemaining = 0;

const BootstrappedDataService = {

  load(startBootstrappedData) {
    bootstrappedData = startBootstrappedData;

    if (bootstrappedData) {
      bootstrappedFieldsRemaining = Object.keys(bootstrappedData).length;
    }
  },

  getFor(ajaxConfig) {
    if (!bootstrappedFieldsRemaining || !ajaxConfig) {
      return;
    }

    const key = BootstrappedDataService.computeKey(ajaxConfig.url, ajaxConfig.data);
    const bootstrappedDataForUrl = bootstrappedData[key];

    if (bootstrappedDataForUrl) {
      bootstrappedData[key] = undefined;
    }

    bootstrappedFieldsRemaining = bootstrappedFieldsRemaining - 1;

    return bootstrappedDataForUrl;
  },

  computeKey(url, queryParams) {
    if (queryParams) {
      return url + encodeURIComponent(JSON.stringify(queryParams));
    }

    return url;
  },

  clear() {
    bootstrappedData = undefined;
    bootstrappedFieldsRemaining = 0;
  }

};

export default BootstrappedDataService;

