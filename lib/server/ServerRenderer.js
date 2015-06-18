"use strict";

var AjaxCallsForCurrentRequest = require("./AjaxCallsForCurrentRequest");

var INITIAL_REQUEST_ID = 1;

var ServerRenderer = {

    render: function(layout, view, environmentConfig, clientAppRequirePath, serverRequest) {
        var title = view.getTitle ? view.getTitle() : null;
        var metatags = view.getMetatags ? view.getMetatags() : null;
        var config = environmentConfig || {};
        var appRoot = config.appRoot || "";
        var clientAppBootstrapFunctionName = null;

        if (typeof config.clientAppBootstrapFunctionName == "string") {
            clientAppBootstrapFunctionName = config.clientAppBootstrapFunctionName;
        }


        layout.renderTitle(title);
        layout.renderMetatags(metatags);

        layout.runDecorators();

        if (view.setUid) {
            view.setUid(layout.generateChildUid(INITIAL_REQUEST_ID));
        }

        layout.setContent(view);

        var clientAppStartScript = makeClientAppStartScript(
            clientAppRequirePath,
            stringifyData(config),
            escapeClosingSlashes(stringifyData(getBootstrappedDataForRequest())),
            clientAppBootstrapFunctionName
        );

        clientAppStartScript = stripIllegalCharacters(clientAppStartScript);

        var html = layout.asHtml();

        html = injectScriptAtBottomOfBody(html, clientAppStartScript);
        html = insertBaseTag(html, appRoot, serverRequest);

        layout.close();

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

function makeClientAppStartScript(clientAppRequirePath, environmentConfig, bootstrappedData, clientAppBootstrapFunctionName) {
    var openScript = "<script type=\"text/javascript\">\n";
    var scriptContent =  "var ClientApp = require('" + clientAppRequirePath + "');\n" +
        "var clientApp = new ClientApp();\n" +
        "clientApp.start({\n" +
        "environmentConfig: " + environmentConfig + ",\n" +
        "bootstrappedData: " + bootstrappedData + "\n" +
        "});\n";
    var closeScript = "</script>";

    return openScript + optionallyExposeScriptOnTheWindow(scriptContent, clientAppBootstrapFunctionName) + closeScript;
}

function optionallyExposeScriptOnTheWindow(script, clientAppBootstrapFunctionName) {
    if (clientAppBootstrapFunctionName) {
        return "window." + clientAppBootstrapFunctionName + " = function() {\n" + script + "};\n";
    }

    return script;
}

function baseTagFrom(appRoot, serverRequest) {
    var host = serverRequest.host;
    var hostAndPath = appRoot ? host + appRoot : host;

    return "<base href='" + serverRequest.protocol + "://" + hostAndPath + "/'>";
}

function insertBaseTag(html, appRoot, serverRequest) {
    var existingBaseTag = /<base[^>]*>/;
    var brisketBaseTag = baseTagFrom(appRoot, serverRequest);

    var htmlWithoutExistingBaseTag = html.replace(existingBaseTag, "");
    var htmlWithBrisketBaseTag = htmlWithoutExistingBaseTag.replace(/<head[^>]*>/, "<head>\n" + brisketBaseTag);

    return htmlWithBrisketBaseTag;
}

function stripIllegalCharacters(input) {
    return input.replace(/\u2028|\u2029/g, '');
}

module.exports = ServerRenderer;

// ----------------------------------------------------------------------------
// Copyright (C) 2015 Bloomberg Finance L.P.
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
