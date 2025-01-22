const additionalMatchers = {

  $toBe() {
    return {
      compare($actual, selector) {
        if ($actual && ($actual.jquery || jasmine.isDomNode($actual))) {
          return passIf($actual.is(selector));
        }

        return fail();
      }
    };
  },

  toContainText() {
    return {
      comapre(actual, text) {
        const trimmedText = actual.text().trim();

        if (text && typeof text.test === 'function') {
          return passIf(text.test(trimmedText));
        }

        return passIf(trimmedText.indexOf(text) != -1);
      }
    };
  },

  toExist() {
    return {
      compare(actual) {
        return passIf(actual.length > 0);
      }
    };
  },

  toBeAttachedToDom() {
    return {
      compare(actual) {
        const $el = actual;
        return passIf($el.closest('body').length > 0);
      }
    };
  },

  toBeHTMLEqual() {
    return {
      compare(actual, expected) {
        return passIf(stripWhiteSpaceBecauseItsNotRelevantToTest(actual) ===
                    stripWhiteSpaceBecauseItsNotRelevantToTest(expected));
      }
    };
  },

  toHaveKey() {
    return {
      compare(actual, key) {
        if (key === null || key === undefined) {
          throw new Error(
            'You cannot ask if something has a key ' +
                        'without the key to look for'
          );
        }

        return passIf(key in actual);
      }
    };
  },

  toHaveKeyValue() {
    return {
      compare(actual, key, value) {
        if (key === null || key === undefined) {
          throw new Error(
            'You cannot ask if something has a key ' +
                        'without the key to look for'
          );
        }

        return passIf(key in actual && actual[key] === value);
      }
    };
  }

};

function stripWhiteSpaceBecauseItsNotRelevantToTest(transformed) {
  let stripped = transformed;
  stripped = stripped.replace(/>[\s]+([\S]+)/g, '>$1');
  stripped = stripped.replace(/([\S]+)[\s]+</g, '$1<');

  return stripped.trim();
}

function fail() {
  return {
    pass: false
  };
}

function passIf(value) {
  return {
    pass: value
  };
}

beforeEach(function() {
  if (typeof this.addMatchers === 'function') {
    this.addMatchers(additionalMatchers);
    return;
  }

  if (typeof jasmine.addMatchers === 'function') {
    jasmine.addMatchers(additionalMatchers);
    return;
  }
});

globalThis.additionalMatchers = additionalMatchers;

