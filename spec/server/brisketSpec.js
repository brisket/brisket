import Brisket from '../../lib/brisket.js';

describe('public interface to Brisket', function() {

  it('exposes Brisket.App', async function() {
    await expectIsModuleAtPath(Brisket.App, 'lib/application/App.js');
  });

  it('exposes Brisket.Router', async function() {
    await expectIsModuleAtPath(Brisket.Router, 'lib/controlling/Router.js');
  });

  it('exposes Brisket.View', async function() {
    await expectIsModuleAtPath(Brisket.View, 'lib/viewing/View.js');
  });

  it('exposes Brisket.Events', async function() {
    await expectIsModuleAtPath(Brisket.Events, 'lib/events/Events.js');
  });

  it('exposes Brisket.Layout', async function() {
    await expectIsModuleAtPath(Brisket.Layout, 'lib/viewing/Layout.js');
  });

  it('exposes Brisket.Templating.TemplateAdapter', async function() {
    await expectIsModuleAtPath(Brisket.Templating.TemplateAdapter, 'lib/templating/TemplateAdapter.js');
  });

  it('exposes Brisket.Templating.StringTemplateAdapter', async function() {
    await expectIsModuleAtPath(Brisket.Templating.StringTemplateAdapter, 'lib/templating/StringTemplateAdapter.js');
  });

  it('exposes Brisket.createServer', async function() {
    await expectIsModuleAtPath(Brisket.createServer, 'lib/server/Server.js', 'create');
  });

  it('exposes Backbone as Brisket.Backbone', async function() {
    await expectIsModuleAtPath(Brisket.Backbone, 'lib/application/Backbone.js');
  });

  it('exposes jquery as Brisket.$', async function() {
    await expectIsModuleAtPath(Brisket.$, 'lib/application/jquery.js');
  });

  it('exposes Brisket.onError', async function() {
    await expectIsModuleAtPath(Brisket.onError, 'lib/errors/Errors.js', 'onError');
  });

  it('exposes Brisket.version', async function() {
    const { default: version } = await import('../../version.json', { with: { type: 'json' } });

    expect(Brisket.version).toBe(version.version);
  });

  async function expectIsModuleAtPath(BrisketProperty, path, key) {
    const { default: module } = await import(`../../${path}`);

    if (key) {
      expect(BrisketProperty).toBe(module[key]);
      return;
    }

    expect(BrisketProperty).toBe(module);
  }
});

