"use strict";

var Compiler = require("../../../lib/compiler");

describe("lib/compiler", function () {

  it("validates options", function () {
    expect(function () {
      new Compiler({
        requirejsLibrary: "not-empty.js"
      });
    }).to.throw(Error);
    expect(function () {
      new Compiler({
        webpackManifest: "not-empty.js"
      });
    }).to.throw(Error);
  });

  it("TODO - NEEDS TESTS", function () {
    new Compiler({
      requirejsLibrary: "TODO",
      webpackManifest: "TODO"
    });
  });

});
