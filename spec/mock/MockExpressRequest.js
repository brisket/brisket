const MockExpressRequest = {

  basic() {
    return {
      protocol: 'http',
      path: '/requested/path',
      host: 'example.com',
      hostname: 'example.com',
      headers: {
        'host': 'example.com:8080',
        'referer': 'theReferrer.com',
        'user-agent': 'A wonderful computer'
      },
      query: {
        some: 'param',
        another: {
          param: 'value'
        }
      },
      originalUrl: '/requested/path?some=param&another%5Bparam%5D=value'
    };
  },

  withoutQueryParam() {
    return {
      protocol: 'http',
      path: '/requested/path',
      host: 'example.com',
      headers: {
        'host': 'example.com:8080',
        'referer': 'theReferrer.com',
        'user-agent': 'A wonderful computer'
      },
      originalUrl: '/requested/path'
    };
  }

};

export default MockExpressRequest;
