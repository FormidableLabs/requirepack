"use strict";

var Compiler = require("../../../lib/compiler");

describe("lib/compiler", function () {

  it("validates required options", function () {
    expect(function () {
      new Compiler({
        requirejsLibrary: "not-empty.js",
        output: "another-one.js"
      });
    }).to.throw(Error);
    expect(function () {
      new Compiler({
        webpackManifest: "not-empty.js",
        output: "another-one.js"
      });
    }).to.throw(Error);
    expect(function () {
      new Compiler({
        requirejsLibrary: "not-empty.js",
        webpackManifest: "not-empty.js"
      });
    }).to.throw(Error);
  });

  it("TODO - NEEDS TESTS", function () {
    new Compiler({
      requirejsLibrary: "lib.js",
      webpackManifest: {
        name: "lib_b9c7be1ffce70ccbda4d",
        content: {
          "./lib.js": 1,
          "./foo.js": 2
        }
      },
      output: "output.js"
    });
  });

});
