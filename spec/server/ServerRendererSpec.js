import _ from 'underscore';
import Backbone from '../../lib/application/Backbone.js';
import ServerRenderer from '../../lib/server/ServerRenderer.js';
import View from '../../lib/viewing/View.js';
import Layout from '../../lib/viewing/Layout.js';
import AjaxCallsForCurrentRequest from '../../lib/server/AjaxCallsForCurrentRequest.js';
import $ from '../../lib/application/jquery.js';
import version from '../../version.json' with { type: 'json' };

describe('ServerRenderer', function() {

  let view;
  let html;
  let layout;
  let environmentConfig;
  let mockServerRequest;

  beforeEach(function() {
    Backbone.$ = $;

    view = new Backbone.View();

    layout = new Layout();
    layout.el.innerHTML = '<html><head><title></title></head><body></body></html>';
    spyOn(layout, 'setContent');
    spyOn(layout, 'close');

    environmentConfig = {
      some: 'environment config'
    };

    mockServerRequest = validMockServerRequest();

    spyOn(AjaxCallsForCurrentRequest, 'all');
  });

  describe('when appRoot is specified', function() {

    beforeEach(function() {
      environmentConfig.appRoot = '/subdir';
    });

    describe('when protocol is http', function() {

      beforeEach(function() {
        mockServerRequest = validMockServerRequest({
          protocol: 'http'
        });
      });

      it('injects base tag with appRoot', function() {
        html = ServerRenderer.render(layout, view, environmentConfig, mockServerRequest);
        expect(html).toMatch(/<base href='http:\/\/host.com\/subdir\/'>/);
      });

    });

    describe('when protocol is https', function() {

      beforeEach(function() {
        mockServerRequest = validMockServerRequest({
          protocol: 'https'
        });
      });

      it('injects base tag with appRoot', function() {
        html = ServerRenderer.render(layout, view, environmentConfig, mockServerRequest);
        expect(html).toMatch(/<base href='https:\/\/host.com\/subdir\/'>/);
      });

    });

  });

  describe('when appRoot is NOT specified', function() {

    beforeEach(function() {
      delete environmentConfig.appRoot;
    });

    describe('when protocol is http', function() {

      beforeEach(function() {
        mockServerRequest = validMockServerRequest({
          protocol: 'http'
        });
      });

      it('injects base tag WITHOUT appRoot', function() {
        html = ServerRenderer.render(layout, view, environmentConfig, mockServerRequest);
        expect(html).toMatch(/<base href='http:\/\/host.com\/'>/);
      });

    });

    describe('when protocol is https', function() {

      beforeEach(function() {
        mockServerRequest = validMockServerRequest({
          protocol: 'https'
        });
      });

      it('injects base tag WITHOUT appRoot', function() {
        html = ServerRenderer.render(layout, view, environmentConfig, mockServerRequest);
        expect(html).toMatch(/<base href='https:\/\/host.com\/'>/);
      });

    });

  });

  describe('when layout has a body', function() {

    it('injects the client app start up script', function() {
      html = ServerRenderer.render(layout, view, environmentConfig, mockServerRequest);

      expect(html).toMatch(clientStartScript(environmentConfig, null));
    });

    describe('when there is bootstrappedData from Backbone ajax requests during the request', function() {
      let bootstrappedData;

      describe('when bootstrappedData does NOT have script tag', function() {

        beforeEach(function() {
          bootstrappedData = {
            '/url': {
              some: 'data'
            }
          };
          AjaxCallsForCurrentRequest.all.and.returnValue(bootstrappedData);
        });

        it('injects the bootstrappedData into the client app start up script', function() {
          html = ServerRenderer.render(layout, view, environmentConfig, mockServerRequest);

          expect(html).toMatch(clientStartScript(environmentConfig, bootstrappedData));
        });

        describe('when there are illegal characters environmentConfig and bootstrappedData', function() {

          beforeEach(function() {
            environmentConfig = {
              some: 'environment\u2028 con\u2029fig'
            };

            bootstrappedData = {
              '/url': {
                some: 'da\u2028\u2029ta'
              }
            };
          });

          it('removes illegal characters in the client start script', function() {
            html = ServerRenderer.render(layout, view, environmentConfig, mockServerRequest);

            expect(html).toMatch(clientStartScript(environmentConfig, bootstrappedData));
          });

        });

      });

      describe('when bootstrappedData has script tag', function() {
        let escapedBootstrappedData;

        beforeEach(function() {
          bootstrappedData = {
            '/url': {
              body: '<script type=\'text/javascript\' src=\'some.js\'></script>'
            }
          };

          AjaxCallsForCurrentRequest.all.and.returnValue(bootstrappedData);
        });

        it('escapes <script> closing tags', function() {
          html = ServerRenderer.render(layout, view, environmentConfig, mockServerRequest);

          escapedBootstrappedData = bootstrappedData;
          escapedBootstrappedData['/url'].body = '<script type=\'text/javascript\' src=\'some.js\'><\\/script>';

          expect(html).toMatch(clientStartScript(environmentConfig, escapedBootstrappedData));
        });

      });

    });

  });

  describe('when view is Brisket.View', function() {

    beforeEach(function() {
      view = new View();
      spyOn(view, 'setUid');
      ServerRenderer.render(layout, view, null, mockServerRequest);
    });

    it('sets uid to reflect initial request and it\'s creation order', function() {
      expect(view.setUid).toHaveBeenCalledWith('1|0_1');
    });

  });

  describe('when view is NOT Brisket.View', function() {

    it('does NOT throw', function() {
      function renderingBackboneView() {
        ServerRenderer.render(layout, view, null, mockServerRequest);
      }

      expect(renderingBackboneView).not.toThrow();
    });

    it('sets the layout content', function() {
      ServerRenderer.render(layout, view, null, mockServerRequest);
      expect(layout.setContent).toHaveBeenCalledWith(view);
    });

  });

  describe('enabling debug mode', function() {

    it('injects client side debug mode script into html when debug is true', function() {
      environmentConfig.debug = true;
      html = ServerRenderer.render(layout, view, environmentConfig, mockServerRequest);
      expect(html).toMatch(/<script>window.BrisketConfig={debug:true};<\/script>/);
    });

    it('does NOT inject client side debug mode script into html when debug is false', function() {
      environmentConfig.debug = false;
      html = ServerRenderer.render(layout, view, environmentConfig, mockServerRequest);
      expect(html).not.toMatch(/<script>window.BrisketConfig={debug:true};<\/script>/);
    });

  });

  function clientStartScript(environmentConfig, bootstrappedData) {
    const pattern = '<script type="text/javascript">\n' +
            'var b = window.BrisketConfig = window.BrisketConfig || {};\n' +
            `b.version = '${version.version}';\n` +
            'b.startConfig = {\n' +
            `environmentConfig: ${stringifyData(environmentConfig)},\n` +
            `bootstrappedData: ${stringifyData(bootstrappedData)}\n` +
            '};\n' +
            '</script>';

    return new RegExp(stripIllegalCharacters(pattern), 'm');
  }

  function stringifyData(data) {
    return JSON.stringify(data || {});
  }

  function stripIllegalCharacters(input) {
    return input.replace(/\u2028|\u2029/g, '');
  }

  function validMockServerRequest(props) {
    return _.extend({
      host: 'host.com',
      protocol: 'https'
    }, props);
  }

});

