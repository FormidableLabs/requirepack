"use strict";

var path = require("path");
var promiseDone = require("../../../util/promise-done");
var build = require("../build");

describe(build.scenario, function () {
  // Extra build to force coverage.
  before(function (done) {
    build.buildRequirePack(done);
  });

  build.getTestPages().forEach(function (page) {
    it(page, function (done) {
      var url = global.TEST_FUNC_BASE_URL + path.join(build.scenario, "dist", page);

      global.adapter.client
        .url(url)

        // Check errors
        .getText("#error").then(function (text) {
          expect(text).to.not.be.ok;
        })

        // Check headings
        .getText("#app1").then(function (text) {
          expect(text).to.equal("App 1");
        })
        .getText("#app2").then(function (text) {
          expect(text).to.equal("App 2");
        })

        // Check messages
        .getText("#msg1").then(function (text) {
          expect(text).to.equal("Message 1");
        })
        .getText("#msg2").then(function (text) {
          expect(text).to.equal("Message 2");
        })

        .finally(promiseDone(done));
    });
  });
});
