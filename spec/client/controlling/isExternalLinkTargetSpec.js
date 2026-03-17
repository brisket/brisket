import isExternalLinkTarget from '../../../lib/controlling/isExternalLinkTarget.js';

describe('isExternalLinkTarget', function() {

  it('returns true when target is \'_blank\'', function() {
    expect(isExternalLinkTarget('_blank')).toBe(true);
  });

  it('returns false when target is a named window', function() {
    expect(isExternalLinkTarget('myWindow')).toBe(true);
  });

  it('returns false when target is \'_self\'', function() {
    expect(isExternalLinkTarget('_self')).toBe(false);
  });

  it('returns false when target is not passed', function() {
    expect(isExternalLinkTarget()).toBe(false);
  });

});

