"use strict";

const fs = require("fs");
const path = require("path");

fs.readdirSync(path.join(__dirname, "benchmarks")).forEach(file => {
    require(`./benchmarks/${ file }`);
});
