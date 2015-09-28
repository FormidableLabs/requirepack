/**
 * Build test distribution
 */
var fs = require("fs");
var path = require("path");
var html = require("../../util/templates").html;

var DEST = path.join(__dirname, "dist");

// Build HTML templates
var templates = module.exports.templates = function () {
  console.log(html([
    { src: "webpack/lib.js" }
  ]));
};

// Build everything
var build = module.exports.build = function () {
  templates();
};

// Script
if (require.main === module) {
  build();
}
