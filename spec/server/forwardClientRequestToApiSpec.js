"use strict";

var forwardClientRequestToApi = require("../../lib/server/forwardClientRequestToApi");

describe("forwardClientRequestToApi", function(){
    var app;
    var req;
    var res;
    var pipe;

    beforeEach(function(){
        var apiHost = "http://api.example.com/api";
        spyOn(forwardClientRequestToApi, "request").and.returnValue(true);
        app = forwardClientRequestToApi(apiHost);
        pipe = jasmine.createSpy('pipe').and.callFake(function(){
            return this;
        });
        req = {
            url: "/model/1",
            pipe: pipe
        };
    });

    it("replaces /api with apiHost", function(){
        var options = {url: "http://api.example.com/api/model/1" };
        app(req,res);
        expect(forwardClientRequestToApi.request).toHaveBeenCalledWith(options);
    });

    it("pipes request and response", function(){
        app(req,res);
        expect(pipe).toHaveBeenCalledWith(true);
        expect(pipe).toHaveBeenCalledWith(res);
    });
});

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
