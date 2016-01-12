"use strict";

var AjaxCallsForCurrentRequest = require("./AjaxCallsForCurrentRequest");
var titleForRouteFrom = require("../util/titleForRouteFrom");
var escapeHtml = require("escape-html");

var INITIAL_REQUEST_ID = 1;
var HTML_TITLE = /(<title[^>]*>)([^<]*)(<\/title>)/mi;

var ServerRenderer = {

    render: function(layout, view, environmentConfig, clientAppRequirePath, serverRequest) {
        var titleForRoute = titleForRouteFrom(layout, view);
        var metatags = view.getMetatags ? view.getMetatags() : null;
        var config = environmentConfig || {};
        var appRoot = config.appRoot || "";
        var clientAppUrl = config.clientAppUrl;

        layout.renderMetatags(metatags);

        layout.runDecorators();

        if (view.setUid) {
            view.setUid(layout.generateChildUid(INITIAL_REQUEST_ID));
        }

        layout.setContent(view);

        var clientAppStartScript = makeClientAppStartScript(
            clientAppRequirePath,
            stringifyData(config),
            escapeClosingSlashes(stringifyData(getBootstrappedDataForRequest()))
        );

        clientAppStartScript = makeBootstrappingLoader(clientAppStartScript, clientAppUrl);
        clientAppStartScript = stripIllegalCharacters(clientAppStartScript);

        var html = layout.asHtml();

        html = injectTitleTag(html, titleForRoute);
        html = injectScriptAtBottomOfBody(html, clientAppStartScript);
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

function makeClientAppStartScript(clientAppRequirePath, environmentConfig, bootstrappedData) {
    return "var ClientApp = require('" + clientAppRequirePath + "');\n" +
        "var clientApp = new ClientApp();\n" +
        "clientApp.start({\n" +
        "environmentConfig: " + environmentConfig + ",\n" +
        "bootstrappedData: " + bootstrappedData + "\n" +
        "});";
}

function makeBootstrappingLoader(scriptBody, clientAppUrl) {
    return "<script type=\"text/javascript\">\n" +
        "var head = document.getElementsByTagName(\"head\")[0] || document.documentElement;\n" +
        "var script = document.createElement(\"script\");\n" +
        "script.src = \"" + clientAppUrl + "\";\n" +
        "var done = false;\n" +
        "script.onload = script.onreadystatechange = function() {\n" +
        "if ( !done && (!this.readyState || this.readyState === \"loaded\" || this.readyState === \"complete\") ) {\n" +
        "done = true;\n" +

        "loaded();\n" +
        // Handle memory leak in IE
        "script.onload = script.onreadystatechange = null;\n" +
        "if ( head && script.parentNode ) {\n" +
        "head.removeChild( script );\n" +
        "}\n" +
        "script = null;\n" +
        "}\n" +
        "};\n" +

        "head.appendChild( script, head.firstChild );\n" +

        "function loaded() {\n" +
        scriptBody + "\n" +
        "}\n" +
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

function injectTitleTag(html, titleForRoute) {
    if (!titleForRoute) {
        return html;
    }

    var escapedTitle = escapeHtml(titleForRoute);

    return html.replace(HTML_TITLE, function(match, titleOpen, oldTitle, titleClose) {
        return titleOpen + escapedTitle + titleClose;
    });
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
