import Brisket from '../../lib/brisket.js';
import SetupLinksAndPushState from '../../lib/client/SetupLinksAndPushState.js';

describe('public interface to Brisket on client', function() {

  it('exposes SetupLinksAndPushState navigateTo', function() {
    expect(Brisket.navigateTo).toBe(SetupLinksAndPushState.navigateTo);
  });

  it('exposes SetupLinksAndPushState reloadRoute', function() {
    expect(Brisket.reloadRoute).toBe(SetupLinksAndPushState.reloadRoute);
  });

  it('exposes SetupLinksAndPushState replacePath', function() {
    expect(Brisket.replacePath).toBe(SetupLinksAndPushState.replacePath);
  });

  it('exposes SetupLinksAndPushState updateLocation', function() {
    expect(Brisket.updateLocation).toBe(SetupLinksAndPushState.updateLocation);
  });

});

