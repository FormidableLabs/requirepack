"use strict";
/*eslint-disable max-statements*/

/**
 * Base server unit test initialization / global before/after's.
 *
 * This file has should be included in any test run, filtered or not.
 */
var path = require("path");

// Set test environment
process.env.NODE_ENV = process.env.NODE_ENV || "test-func";

// ----------------------------------------------------------------------------
// Selenium (Webdriverio/Rowdy) initialization
// ----------------------------------------------------------------------------
// **Note** Can stash adapter, but not `adapter.client` because it is a lazy
// getter that relies on the global `before|beforeEach` setup.
var adapter = global.adapter;
var ELEM_WAIT = 200; // Global wait.

adapter.before();
before(function (done) {
  adapter.client
    // Set timeout for waiting on elements.
    .timeoutsImplicitWait(ELEM_WAIT)
    .call(done);
});

adapter.beforeEach();
adapter.afterEach();
adapter.after();

// ----------------------------------------------------------------------------
// Globals and dev. server initialization.
// ----------------------------------------------------------------------------
var APP_PORT = process.env.TEST_FUNC_PORT || 3030;
var APP_HOST = process.env.TEST_FUNC_HOST || "127.0.0.1";
var httpServer = require("http-server");
var server;

// ----------------------------------------------------------------------------
// Globals
// ----------------------------------------------------------------------------
before(function () {
  // Export global base server URL for tests to hit.
  global.TEST_FUNC_BASE_URL = process.env.TEST_FUNC_BASE_URL ||
    "http://" + APP_HOST + ":" + APP_PORT + "/";
});

// ----------------------------------------------------------------------------
// App server
// ----------------------------------------------------------------------------
before(function (done) {
  server = httpServer.createServer();
  server.listen(APP_PORT, APP_HOST, done);
});

after(function (done) {
  if (!(server && server.server)) { return done(); }
  // `http-server` doesn't pass the close callback, so we hack into the
  // underlying implementation. Sigh.
  server.server.close(done);
});
