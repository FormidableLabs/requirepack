"use strict";

/**
 * Build test scenario (HTML, JS).
 */
var Build = require("../../util/build");
var build = module.exports = new Build({
  rootDir: __dirname,
  requirepack: {
    empty: [
      "hbs"
    ],
    alias: {
      "hbs/handlebars": "handlebars/runtime"
    },
    // Transforms occur in order and do not stop after first match.
    transforms: [
      // Match the NormalModuleReplacementPlugin path switch we do in Webpack
      // for HBS files and the `hbs!` plugin
      {
        test: /^hbs!+/,
        transform: function (name) {
          return name.slice(4) + ".hbs";
        }
      }
    ]
  }
});

if (require.main === module) {
  //TODObuild.run();
  build.buildRequirePack(); // TODO REMOVE & PLACE IN test `before`
}
