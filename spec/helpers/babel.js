"use strict";

var path = require("path");
require("babel/register")({
  only: new RegExp(path.join(__dirname, "../../lib"))
});
