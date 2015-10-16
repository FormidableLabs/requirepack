"use strict";

var path = require("path");
var promiseDone = require("../../../util/promise-done");
var retry = require("../../../util/retry");
var build = require("../build");

describe(build.scenario, function () {
  Object.keys(build.PAGES).forEach(function (page) {
    it(page, retry(3, function (done) {
      var url = global.TEST_FUNC_BASE_URL + path.join(build.scenario, "dist", page);

      global.adapter.client
        .url(url)

        // Check headings
        .getText("#app1").then(function (text) {
          expect(text).to.equal("App 1");
        })
        .getText("#app2").then(function (text) {
          expect(text).to.equal("App 2");
        })

        .finally(promiseDone(done));
    }));
  });
});
