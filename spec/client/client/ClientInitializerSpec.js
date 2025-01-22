import ClientInitializer from '../../../lib/client/ClientInitializer.js';
import ClientRenderingWorkflow from '../../../lib/client/ClientRenderingWorkflow.js';
import ClientAjax from '../../../lib/client/ClientAjax.js';
import ViewsFromServer from '../../../lib/viewing/ViewsFromServer.js';

describe('ClientInitializer', function() {

  let bootstrappedData;

  beforeEach(function() {
    bootstrappedData = {};

    spyOn(ClientAjax, 'setup');
    spyOn(ClientRenderingWorkflow, 'setEnvironmentConfig');
    spyOn(ViewsFromServer, 'initialize');
  });

  describe('when it runs', function() {

    beforeEach(function() {
      ClientInitializer.forApp(validOptions());
    });

    it('initializes views from server', function() {
      expect(ViewsFromServer.initialize).toHaveBeenCalled();
    });

    it('sets up ClientAjax', function() {
      expect(ClientAjax.setup).toHaveBeenCalledWith(bootstrappedData, '/appRoot');
    });

  });

  describe('when environmentConfig is passed in config', function() {

    beforeEach(function() {
      ClientInitializer.forApp({
        environmentConfig: {
          'made': 'in client app spec'
        }
      });
    });

    it('sets environment config for client rendering to be passed environmentConfig', function() {
      expect(ClientRenderingWorkflow.setEnvironmentConfig)
        .toHaveBeenCalledWith({
          'made': 'in client app spec'
        });
    });

  });

  function validOptions() {
    return {
      bootstrappedData,
      environmentConfig: {
        appRoot: '/appRoot'
      }
    };
  }

});

