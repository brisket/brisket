"use strict";

var AjaxCallsForCurrentRequest = require("./AjaxCallsForCurrentRequest");

var INITIAL_REQUEST_ID = 1;
var HEAD_ENDING = /(<\/head>)/mi;
var DEBUG_MODE_SCRIPT = "<script>window.Brisket={debug:true};</script>";

var ServerRenderer = {

    render: function(layout, view, environmentConfig, serverRequest) {
        var config = environmentConfig || {};
        var appRoot = config.appRoot || "";

        if (view.setUid) {
            view.setUid(layout.generateChildUid(INITIAL_REQUEST_ID));
        }

        layout.setContent(view);

        var clientStartScript = makeClientStartScript(
            stringifyData(config),
            escapeClosingSlashes(stringifyData(getBootstrappedDataForRequest()))
        );

        clientStartScript = stripIllegalCharacters(clientStartScript);

        var html = layout.asHtml();

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
    return string.replace(/<\/script/g, "<\\/script");
}

function injectScriptAtBottomOfBody(html, script) {
    return html.replace(/<\/body>\s*<\/html>\s*$/i, script + "</body></html>");
}

function makeClientStartScript(environmentConfig, bootstrappedData) {
    return "<script type=\"text/javascript\">\n" +
        "var b = window.Brisket = window.Brisket || {};\n" +
        "b.version = '" + require("../../version.json").version + "';\n" +
        "b.startConfig = {\n" +
        "environmentConfig: " + environmentConfig + ",\n" +
        "bootstrappedData: " + bootstrappedData + "\n" +
        "};\n" +
        "</script>";
}

function baseTagFrom(appRoot, serverRequest) {
    var host = serverRequest.host;
    var hostAndPath = appRoot ? host + appRoot : host;

    return "<base href='" + serverRequest.protocol + "://" + hostAndPath + "/'>";
}

function injectBaseTag(html, appRoot, serverRequest) {
    var existingBaseTag = /<base[^>]*>/;
    var brisketBaseTag = baseTagFrom(appRoot, serverRequest);

    var htmlWithoutExistingBaseTag = html.replace(existingBaseTag, "");
    var htmlWithBrisketBaseTag = htmlWithoutExistingBaseTag.replace(/<head[^>]*>/, "<head>\n" + brisketBaseTag);

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

module.exports = ServerRenderer;

// ----------------------------------------------------------------------------
// Copyright (C) 2018 Bloomberg Finance L.P.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ----------------------------- END-OF-FILE ----------------------------------
