import AjaxCallsForCurrentRequest from './AjaxCallsForCurrentRequest.js';
import version from '../../version.json' with { type: 'json' };

const INITIAL_REQUEST_ID = 1;
const HEAD_ENDING = /(<\/head>)/mi;
const DEBUG_MODE_SCRIPT = '<script>window.BrisketConfig={debug:true};</script>';

const ServerRenderer = {

  render(layout, view, environmentConfig, serverRequest) {
    const config = environmentConfig || {};
    const appRoot = config.appRoot || '';

    if (view.setUid) {
      view.setUid(layout.generateChildUid(INITIAL_REQUEST_ID));
    }

    layout.setContent(view);

    let clientStartScript = makeClientStartScript(
      stringifyData(config),
      escapeClosingSlashes(stringifyData(getBootstrappedDataForRequest()))
    );

    clientStartScript = stripIllegalCharacters(clientStartScript);

    let html = layout.asHtml();

    html = injectDebugMode(html, config);
    html = injectScriptAtBottomOfBody(html, clientStartScript);
    html = injectBaseTag(html, appRoot, serverRequest);

    return html;
  }

};

function getBootstrappedDataForRequest() {
  return AjaxCallsForCurrentRequest.all();
}

function stringifyData(data) {
  return JSON.stringify(data || {});
}

function escapeClosingSlashes(string) {
  return string.replace(/<\/script/g, '<\\/script');
}

function injectScriptAtBottomOfBody(html, script) {
  return html.replace(/<\/body>\s*<\/html>\s*$/i, `${script}</body></html>`);
}

function makeClientStartScript(environmentConfig, bootstrappedData) {
  return '<script type="text/javascript">\n' +
        'var b = window.BrisketConfig = window.BrisketConfig || {};\n' +
        `b.version = '${version.version}';\n` +
        'b.started = false;\n' +
        'b.startConfig = {\n' +
        `environmentConfig: ${environmentConfig},\n` +
        `bootstrappedData: ${bootstrappedData}\n` +
        '};\n' +
        '</script>';
}

function baseTagFrom(appRoot, serverRequest) {
  const host = serverRequest.host;
  const hostAndPath = appRoot ? host + appRoot : host;

  return `<base href='${serverRequest.protocol}://${hostAndPath}/'>`;
}

function injectBaseTag(html, appRoot, serverRequest) {
  const existingBaseTag = /<base[^>]*>/;
  const brisketBaseTag = baseTagFrom(appRoot, serverRequest);

  const htmlWithoutExistingBaseTag = html.replace(existingBaseTag, '');
  const htmlWithBrisketBaseTag = htmlWithoutExistingBaseTag.replace(/<head[^>]*>/, `<head>\n${brisketBaseTag}`);

  return htmlWithBrisketBaseTag;
}

function stripIllegalCharacters(input) {
  return input.replace(/\u2028|\u2029/g, '');
}

function injectDebugMode(html, config) {
  if (!config.debug) {
    return html;
  }

  return html.replace(HEAD_ENDING, function(match, headEnding) {
    return DEBUG_MODE_SCRIPT + headEnding;
  });
}

export default ServerRenderer;

