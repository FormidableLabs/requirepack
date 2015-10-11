"use strict";

/**
 * Build test scenario (HTML, JS).
 */
var Build = require("../../util/build");
var build = module.exports = new Build({
  rootDir: __dirname,
  requirepack: require("./requirepack.config")
});

if (require.main === module) {
  build.run();
}
