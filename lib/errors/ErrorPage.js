const DEFAULT_ERROR_CODE = 500;

const ErrorPage = {

  viewFor(errorViewMapping, statusCode) {
    if (!errorViewMapping) {
      return null;
    }

    return errorViewMapping[statusCode] || errorViewMapping[DEFAULT_ERROR_CODE];
  },

  getStatus(errorViewMapping, statusCode) {
    if (errorViewMapping && !!errorViewMapping[statusCode]) {
      return statusCode;
    }

    return DEFAULT_ERROR_CODE;
  }

};

export default ErrorPage;

