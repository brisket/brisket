import App from '../../../lib/application/App.js';
import ClientInitializer from '../../../lib/client/ClientInitializer.js';
import SetupLinksAndPushState from '../../../lib/client/SetupLinksAndPushState.js';
import Browser from '../../../lib/client/Browser.js';

describe('App starts client', function() {

  let startConfig;
  let serverRendererStartScript;

  beforeEach(function() {
    serverRendererStartScript = {
      startConfig: {
        environmentConfig: {
          appRoot: 'root'
        }
      }
    };

    startConfig = serverRendererStartScript.startConfig;

    spyOn(ClientInitializer, 'forApp');
    spyOn(SetupLinksAndPushState, 'start');
  });

  afterEach(function() {
    App.reset();
    window.BrisketConfig = undefined;
  });

  describe('when server renderer start script is available already', function() {

    beforeEach(function() {
      whenAppStartsSync();
    });

    it('initializes app on client', function() {
      expect(ClientInitializer.forApp).toHaveBeenCalledWith(startConfig);
    });

    it('initializes setup links and push state', function() {
      expect(SetupLinksAndPushState.start).toHaveBeenCalled();
    });

  });

  describe('when server renderer start script is NOT available already', function() {

    beforeEach(function() {
      whenAppStartsAsync();
    });

    it('initializes app on client', function() {
      expect(ClientInitializer.forApp).toHaveBeenCalledWith(startConfig);
    });

    it('initializes setup links and push state', function() {
      expect(SetupLinksAndPushState.start).toHaveBeenCalled();
    });

  });

  describe('setting up links and push state', function() {

    it('sets up links with push state when push state is available', function() {
      spyOn(Browser, 'hasPushState').and.returnValue(true);

      whenAppStartsSync();

      expect(SetupLinksAndPushState.start).toHaveBeenCalledWith({
        root: 'root',
        browserSupportsPushState: true
      });
    });

    it('sets up links without push state when push state is NOT available', function() {
      spyOn(Browser, 'hasPushState').and.returnValue(false);

      whenAppStartsSync();

      expect(SetupLinksAndPushState.start).toHaveBeenCalledWith({
        root: 'root',
        browserSupportsPushState: false
      });
    });

    it('sets up links with appRoot when appRoot is passed in', function() {
      spyOn(Browser, 'hasPushState').and.returnValue(false);

      whenAppStartsSync();

      expect(SetupLinksAndPushState.start).toHaveBeenCalledWith({
        root: 'root',
        browserSupportsPushState: false
      });
    });

    it('sets up links without appRoot when appRoot is NOT passed in', function() {
      startConfig.environmentConfig.appRoot = undefined;
      spyOn(Browser, 'hasPushState').and.returnValue(false);

      whenAppStartsSync();

      expect(SetupLinksAndPushState.start).toHaveBeenCalledWith({
        root: '',
        browserSupportsPushState: false
      });
    });

  });

  function whenAppStartsSync() {
    window.BrisketConfig = serverRendererStartScript;
    App.start();
  }

  function whenAppStartsAsync() {
    App.start();
    window.BrisketConfig.startConfig = startConfig;
  }

});
