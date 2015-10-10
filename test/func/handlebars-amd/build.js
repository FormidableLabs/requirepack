"use strict";

/**
 * Build test scenario (HTML, JS).
 */
var Build = require("../../util/build");
var build = module.exports = new Build({
  rootDir: __dirname,
  requirepack: require("./requirepack.config")
});

// Patch RequireJS dev scenario to use real compiler.
build.PAGES["requirejs-baseline-dev.html"] = [
  { src: "../../../../node_modules/requirejs/require.js" },
  { src: "../requirejs.config.js" },
  function () {
    require.config({
      baseUrl: "../src",
      map: {
        "*": {
          // Use full HBS compiler in dev. mode.
          "handlebars": "hbs/handlebars",
          "Handlebars": "hbs/handlebars"
        }
      }
    });
    require(["lib"], function () {
      require(["app1", "app2"]);
    });
  }.toString()
];

if (require.main === module) {
  build.run();
}
