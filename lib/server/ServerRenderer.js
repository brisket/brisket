"use strict";

var AjaxCallsForCurrentRequest = require("./AjaxCallsForCurrentRequest");

var INITIAL_REQUEST_ID = 1;

var ServerRenderer = {

    render: function(layout, view, onRender, host, environmentConfig, clientAppRequirePath, request) {
        var title = view.getTitle ? view.getTitle() : null;
        var metatags = view.getMetatags ? view.getMetatags() : null;
        var appRoot = environmentConfig ? environmentConfig.appRoot : "";

        layout.setTitle(title);

        layout.setMetaTags(metatags);

        layout.setEnvironmentConfig(environmentConfig);

        if (typeof onRender == "function") {
            layout.setExtraRenderInstructions(function(layout) {
                onRender(layout);
            });
        }

        layout.render();

        if (view.setUid) {
            view.setUid(layout.generateChildUid(INITIAL_REQUEST_ID));
        }

        layout.setContent(view);

        var clientAppStartScript = makeClientAppStartScript(
            clientAppRequirePath,
            stringifyData(environmentConfig),
            escapeClosingSlashes(stringifyData(getBootstrappedDataForRequest()))
        );

        injectScriptAtBottomOfBodyOf(layout, clientAppStartScript);

        var htmlWithBaseTagAndStartScript = insertBaseTag(layout.asHtml(), host, appRoot, request);

        layout.close();

        return htmlWithBaseTagAndStartScript;
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

function injectScriptAtBottomOfBodyOf(layout, script) {
    var body = layout.$body().get(0);

    if (!body) {
        return;
    }

    body.innerHTML += script;
}

function makeClientAppStartScript(clientAppRequirePath, environmentConfig, bootstrappedData) {
    return "<script type=\"text/javascript\">\n" +
        "var ClientApp = require('" + clientAppRequirePath + "');\n" +
        "var clientApp = new ClientApp();\n" +
        "clientApp.start({\n" +
        "environmentConfig: " + environmentConfig + ",\n" +
        "bootstrappedData: " + bootstrappedData + "\n" +
        "});\n" +
        "</script>";
}

function baseTag(host, appRoot, request) {
    // TODO: we would prefer to use Protocol-relative URLs but IE9
    //  does not seem to support them in the base tag. If we need
    //  to be completely protocol agnostic, we will need to pass in
    //  the protocol from the request.
    var hostAndPath = appRoot ? host + appRoot : host;

    return '<base href="' + request.protocol + '://' + hostAndPath + '/">';
}

function insertBaseTag(html, host, appRoot, request) {
    var hasBase = /<base[^>]*>/;

    if (hasBase.test(html)) {
        return html.replace(hasBase, baseTag(host, appRoot, request));
    }

    return html.replace(/<head[^>]*>/, "<head>\n    " + baseTag(host, appRoot, request));
}

module.exports = ServerRenderer;

// ----------------------------------------------------------------------------
// Copyright (C) 2014 Bloomberg Finance L.P.
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
