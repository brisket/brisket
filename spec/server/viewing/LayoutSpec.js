import Layout from '../../../lib/viewing/Layout.js';

describe('Layout', function() {

  let ExampleLayout;
  let layout;

  beforeEach(function() {
    ExampleLayout = Layout.extend({
      template: '<!doctype html>\n' +
                '<html data-type=\'html\'>\n' +
                '\t<head data-type=\'head\'>\n' +
                '\t\t<title>original</title>\n' +
                '\t</head>\n' +
                '\t<body class=\'layout\'>\n' +
                '\t</body>\n' +
                '</html>'
    });

    layout = new ExampleLayout();
  });

  describe('#asHtml', function() {

    describe('when template has NOT been rendered', function() {

      it('returns empty html element', function() {
        expect(layout.asHtml()).toBe('<html></html>');
      });

    });

    describe('when template has been rendered', function() {

      const hasDoctype = /<!doctype[^>]*>/i;
      const preservesAttributesInHtmlTag = /<html data-type='html'>/i;
      const preservesAttributesInBodyTag = /<body class="layout">/i;
      const preservesAttributesInHeadTag = /<head data-type="head">/i;

      beforeEach(function() {
        layout.renderTemplate();
      });

      it('preserves attributes on html tag', function() {
        expect(layout.asHtml()).toMatch(preservesAttributesInHtmlTag);
      });

      it('preserves attributes on body tag', function() {
        expect(layout.asHtml()).toMatch(preservesAttributesInBodyTag);
      });

      it('preserves attributes on head tag', function() {
        expect(layout.asHtml()).toMatch(preservesAttributesInHeadTag);
      });

      it('renders one html tag', function() {
        expect(layout.asHtml().match(/<html[^>]*>/ig).length).toEqual(1);
      });

      it('renders one head tag', function() {
        expect(layout.asHtml().match(/<head[^>]*>/ig).length).toEqual(1);
      });

      it('renders one body tag', function() {
        expect(layout.asHtml().match(/<body[^>]*>/ig).length).toEqual(1);
      });

      describe('when template has a doctype', function() {

        it('has doctype in output html', function() {
          expect(layout.asHtml()).toMatch(hasDoctype);
        });

      });

      describe('when template does NOT have a doctype', function() {

        beforeEach(function() {
          ExampleLayout = Layout.extend({
            template: '<html></html>'
          });

          layout = new ExampleLayout();
        });

        it('does NOT have a doctype in output html', function() {
          expect(layout.asHtml()).not.toMatch(hasDoctype);
        });

      });

    });

  });

  describe('#isSameTypeAs', function() {

    let Layout1;
    let Layout2;

    beforeEach(function() {
      Layout1 = Layout.extend();
      Layout2 = Layout.extend();
    });

    it('is NOT considered the same type as it\'s base type', function() {
      layout = new Layout1();

      expect(layout.isSameTypeAs(Layout)).toBe(false);
    });

    describe('when a layout instance is the same type as another instance', function() {

      beforeEach(function() {
        layout = new Layout1();
      });

      it('returns true', function() {
        expect(layout.isSameTypeAs(Layout1)).toBe(true);
      });

    });

    describe('when one layout instance is NOT the same type as another instance', function() {

      beforeEach(function() {
        layout = new Layout1();
      });

      it('returns false', function() {
        expect(layout.isSameTypeAs(Layout2)).toBe(false);
      });

    });

  });

});

