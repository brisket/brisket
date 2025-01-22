import { isClient, onlyRunsOnClient, clientDebuggingEnabled } from '../../../lib/environment/Environment.js';

describe('Environment', () => {
  let originalWindowBrisketConfig;

  beforeEach(() => {
    originalWindowBrisketConfig = window.BrisketConfig;
    window.BrisketConfig = undefined;
  });

  afterEach(() => {
    window.BrisketConfig = originalWindowBrisketConfig;
  });

  describe('#isClient', () => {

    it('returns true when on client', () => {
      expect(isClient()).toBe(true);
    });

  });

  describe('#onlyRunsOnClient', () => {
    it('returns the function as-is when on client', () => {
      const fn = () => {};
      expect(onlyRunsOnClient(fn)).toBe(fn);
    });
  });

  describe('#clientDebuggingEnabled', () => {

    it('returns false when window.BrisketConfig does NOT exist', () => {
      expect(clientDebuggingEnabled()).toBe(false);
    });

    it('returns false when window.BrisketConfig.debug !== true', () => {
      window.BrisketConfig = {
        debug: false
      };
      expect(clientDebuggingEnabled()).toBe(false);

    });

    it('returns true when on client and window.BrisketConfig.debug === true', () => {
      window.BrisketConfig = {
        debug: true
      };
      expect(clientDebuggingEnabled()).toBe(true);
    });

  });

});

