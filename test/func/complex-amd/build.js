"use strict";

/**
 * Build test scenario (HTML, JS).
 */
var _ = require("lodash");
var webpackConfig = require("./webpack.config.lib");
var Build = require("../../util/build");

var build = module.exports = new Build({
  rootDir: __dirname,
  requirepack: {
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
    ],

    // Aliases match whole tokens or partial path prefixes at file-separator
    // barriers.
    alias: _.extend({
      // RequireJS -> Webpack aliases.
      "hbs/handlebars": "handlebars/runtime"

      // Direct import the webpack aliases. Currently, this gives us:
      // - `custom-alias`
      //
      // **Note**: This only works for easy, straight aliases, not things like
      // `$` suffixed aliases in
      // https://webpack.github.io/docs/configuration.html#resolve-alias
      //
      // See: https://github.com/FormidableLabs/requirepack/issues/11
      //
      // Also note that we could _instead_ do via manual `transforms`.
    }, webpackConfig.resolve.alias),

    // Empties are whole token matches only.
    empty: [
      "hbs"
    ]
  }
});

if (require.main === module) {
  build.run();
}
