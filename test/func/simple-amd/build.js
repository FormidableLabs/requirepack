"use strict";

/**
 * Build test scenario (HTML, JS).
 */
var Build = require("../../util/build");
var build = module.exports = new Build({
  rootDir: __dirname
});

if (require.main === module) {
  build.run();
}
