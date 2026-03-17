import Brisket from '../../lib/brisket.js';
import noop from '../../lib/util/noop.js';

describe('public interface to Brisket on server', function() {

  it('noops navigateTo', function() {
    expect(Brisket.navigateTo).toBe(noop);
  });

  it('noops reloadRoute', function() {
    expect(Brisket.reloadRoute).toBe(noop);
  });

  it('noops replacePath', function() {
    expect(Brisket.replacePath).toBe(noop);
  });

  it('noops changePath', function() {
    expect(Brisket.changePath).toBe(noop);
  });

});

