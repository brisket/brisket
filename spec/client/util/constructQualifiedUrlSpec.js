import constructQualifiedUrl from '../../../lib/util/constructQualifiedUrl.js';

describe('constructQualifiedUrl', function() {

  describe('parameters', function() {

    it('requires a protocol', function() {
      expect(callWithoutProtocol()).toBe(null);
    });

    it('requires a host', function() {
      expect(callWithoutHost()).toBe(null);
    });

  });

  describe('when called without a host and protocol, but not a path', function() {

    it('returns a URL with the protocol and host', function() {
      expect(callWithoutPath()).toEqual('protocol://host');
    });

  });

  describe('when called with a protocol, host, and path', function() {

    it('returns a URL with the protocol, host, and path', function() {
      expect(callWithAllArguments()).toEqual('protocol://host/path');
    });

  });

  function callWithoutProtocol() {
    return constructQualifiedUrl({
      host: 'host'
    });
  }

  function callWithoutHost() {
    return constructQualifiedUrl({
      protocol: 'protocol'
    });
  }

  function callWithoutPath() {
    return constructQualifiedUrl({
      protocol: 'protocol',
      host: 'host'
    });
  }

  function callWithAllArguments() {
    return constructQualifiedUrl({
      protocol: 'protocol',
      host: 'host',
      path: '/path'
    });
  }

});

