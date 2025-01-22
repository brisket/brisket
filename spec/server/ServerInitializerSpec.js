import ServerInitializer from '../../lib/server/ServerInitializer.js';
import Response from '../../lib/controlling/Response.js';
import ServerAjax from '../../lib/server/ServerAjax.js';

describe('ServerInitializer', function() {

  let apis;

  beforeEach(function() {
    spyOn(Response, 'setAppRoot');
    spyOn(ServerAjax, 'setup');

    apis = {};

    ServerInitializer.forApp({
      environmentConfig: {
        appRoot: '/root'
      },
      serverConfig: {
        apis
      }
    });
  });

  it('sets server response approot', function() {
    expect(Response.setAppRoot).toHaveBeenCalledWith('/root');
  });

  it('sets up server ajax', function() {
    expect(ServerAjax.setup).toHaveBeenCalledWith(apis);
  });

});

