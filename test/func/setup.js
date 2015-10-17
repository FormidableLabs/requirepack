"use strict";

/**
 * Test setup for functional tests.
 */
var chai = require("chai");

// Enable Rowdy with webdriverio.
var _ = require("lodash");
var rowdy = require("rowdy")(_.merge({}, require("rowdy/config"), {
  options: {
    driverLib: "webdriverio",
    server: {
      start: process.env.TRAVIS !== "true"
    }
  }
}));
var Adapter = rowdy.adapters.mocha;

// Patch rowdy to force not started.
// TODO: FIX IN ROWDY
if ((rowdy.setting.server || {}).start) {
  rowdy.setting.server.start = process.env.TRAVIS !== "true";
}

// Add test lib globals.
global.expect = chai.expect;
global.adapter = new Adapter();

// Set test environment
process.env.NODE_ENV = "test-func";
