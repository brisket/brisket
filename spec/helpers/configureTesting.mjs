import BrisketTesting from '../../testing.js';
import Deprecated from '../../lib/util/Deprecated.js';

beforeEach(function() {
  BrisketTesting.setup();
  spyOn(Deprecated, 'message');
});

