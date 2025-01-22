import App from '../../lib/application/App.js';

describe('App on server', function() {

  it('does NOT error when you call start', function() {
    function callingAppStartOnServer() {
      App.start();
    }

    expect(callingAppStartOnServer).not.toThrow();
  });

});
