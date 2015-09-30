"use strict";

var path = require("path");
var promiseDone = require("../../../util/promise-done");
var adapter = global.adapter;

var PAGES = require("../build").PAGES;
var scenario = path.relative(
  path.join(__dirname, "../../../.."),
  path.join(__dirname, ".."));
var distPath = path.join(scenario, "dist");

describe(scenario, function () {
  Object.keys(PAGES).forEach(function (page) {
    it(page, function (done) {
      var url = global.TEST_FUNC_BASE_URL + path.join(distPath, page);

      adapter.client
        .url(url)

        // Check headings
        .getText("#app1").then(function (text) {
          expect(text).to.equal("App 1");
        })
        .getText("#app2").then(function (text) {
          expect(text).to.equal("App 2");
        })

        .finally(promiseDone(done));
    });
  });
});
