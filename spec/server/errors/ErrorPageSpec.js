import ErrorPage from '../../../lib/errors/ErrorPage.js';
import Backbone from '../../../lib/application/Backbone.js';

describe('ErrorPage', function() {

  let errorViewMapping;
  let PageNotFoundView;
  let ErrorView;

  describe('#viewFor', function() {

    beforeEach(function() {
      createValidErrorViewMapping();
    });

    it('returns null when errorViewMapping is empty', function() {
      expect(ErrorPage.viewFor(null, 500)).toBe(null);
    });

    describe('when statusCode is in mapping', function() {

      it('returns the View mapping to the statusCode', function() {
        expect(ErrorPage.viewFor(errorViewMapping, 404)).toBe(PageNotFoundView);
      });

    });

    describe('when statusCode is NOT in mapping', function() {

      it('returns the View mapping to a 500 statusCode', function() {
        expect(ErrorPage.viewFor(errorViewMapping, 234)).toBe(ErrorView);
      });

    });

  });

  describe('#getStatus', function() {

    beforeEach(function() {
      createValidErrorViewMapping();
    });

    it('returns 500 when errorViewMapping is empty', function() {
      expect(ErrorPage.getStatus(null, 500)).toBe(500);
    });

    describe('when statusCode is in mapping', function() {

      it('returns the statusCode', function() {
        expect(ErrorPage.getStatus(errorViewMapping, 404)).toBe(404);
      });

    });

    describe('when statusCode is NOT in mapping', function() {

      it('returns 500', function() {
        expect(ErrorPage.getStatus(errorViewMapping, 234)).toBe(500);
      });

    });

  });

  function createValidErrorViewMapping() {
    PageNotFoundView = Backbone.View.extend({
      name: 'page_not_found'
    });
    ErrorView = Backbone.View.extend({
      name: 'unhandled_error'
    });

    errorViewMapping = {
      404: PageNotFoundView,
      500: ErrorView
    };
  }

});

