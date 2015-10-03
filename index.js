"use strict";

var Compiler = require("./lib/compiler");

module.exports = {
  compile: function (opts, callback) {
    return Compiler.compile(opts, callback);
  }
};
