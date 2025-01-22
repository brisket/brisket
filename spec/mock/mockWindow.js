function mockWindow() {
  return {
    document: {
      referrer: 'theReferrer'
    },
    location: {
      protocol: 'http:',
      host: 'example.com:8080',
      hostname: 'example.com',
      pathname: '/requested/path',
      search: '?some=param&another%5Bparam%5D=value',
      replace: jasmine.createSpy('mockWindow.location.replace')
    },
    navigator: {
      userAgent: 'A wonderful computer'
    }
  };
}

export default mockWindow;

