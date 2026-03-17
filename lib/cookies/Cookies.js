const COOKIES_AVAILABLE_PROPERTY = 'brisket:wantsCookies';

const Cookies = {

  letClientKnowIfAvailable(environmentConfig, expressRequest) {
    const cookiesAvailable = typeof expressRequest.cookies === 'object';

    environmentConfig[COOKIES_AVAILABLE_PROPERTY] = cookiesAvailable;
  },

  areAvailable(environmentConfig) {
    return environmentConfig[COOKIES_AVAILABLE_PROPERTY] === true;
  }

};

export default Cookies;

