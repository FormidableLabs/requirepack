/**
 * Build test distribution
 */
var fs = require("fs-extra");
var path = require("path");
var html = require("../../util/templates").html;

var DEST_DIR = path.join(__dirname, "dist");
var writeHtml = function (destPath, scripts) {
  var dest = path.join(DEST_DIR, destPath);
  fs.outputFileSync(dest, html(scripts));
};

// Clean
var clean = module.exports.clean = function () {
  fs.emptyDirSync(DEST_DIR);
};

// Build HTML templates
var templates = module.exports.templates = function () {
  // **Baseline**: Use existing loaders to verify original builds are honest.
  writeHtml("webpack-baseline.html", [
    { src: "webpack/lib.js" },
    { src: "webpack/app1.js" },
    { src: "webpack/app2.js" }
  ]);

  writeHtml("requirejs-baseline-build.html", [
    { src: "../../../node_modules/requirejs/require.js" },
    { src: "requirejs/lib.js" },
    { src: "requirejs/app1.js" },
    { src: "requirejs/app2.js" }
  ]);

  writeHtml("requirejs-baseline-almond.html", [
    { src: "../../../node_modules/almond/almond.js" },
    { src: "requirejs/lib.js" },
    { src: "requirejs/app1.js" },
    { src: "requirejs/app2.js" }
  ]);
};

// Build everything
var build = module.exports.build = function () {
  clean();
  templates();
};

// Script
if (require.main === module) {
  build();
}
