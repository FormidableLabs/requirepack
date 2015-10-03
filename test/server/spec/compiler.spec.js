"use strict";

var path = require("path");
var Compiler = require("../../../lib/compiler");
var WEBPACK_MANIFEST_PATH = path.join(__dirname,
  "../fixtures/webpack/lib-manifest.json");

describe("lib/compiler", function () {

  describe("constructor", function () {})

  it("validates required options", function () {
    expect(function () {
      new Compiler({
        requirejsLibrary: "not-empty.js",
        output: "another-one.js"
      });
    }).to.throw(Error);

    expect(function () {
      new Compiler({
        webpackManifest: WEBPACK_MANIFEST_PATH,
        output: "another-one.js"
      });
    }).to.throw(Error);

    expect(function () {
      new Compiler({
        requirejsLibrary: "not-empty.js",
        webpackManifest: { name: "lib", content: {} },
      });
    }).to.throw(Error);
  });

  it("accepts webpack manifest path", function () {
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

  it("accepts webpack manifest object", function () {
    new Compiler({
      requirejsLibrary: "lib.js",
      webpackManifest: WEBPACK_MANIFEST_PATH,
      output: "output.js"
    });
  });

});
