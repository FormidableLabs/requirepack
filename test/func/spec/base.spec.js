"use strict";
/*eslint-disable max-statements, no-invalid-this */

/**
 * Base server unit test initialization / global before/after's.
 *
 * This file has should be included in any test run, filtered or not.
 */
// Set test environment
process.env.NODE_ENV = process.env.NODE_ENV || "test-func";

// ----------------------------------------------------------------------------
// Sauce Connect Tunnel
// ----------------------------------------------------------------------------
var rowdy = require("rowdy");
var isSauceLabs = rowdy.config.setting.isSauceLabs;

if (isSauceLabs) {
  var connect = require("sauce-connect-launcher");
  var connectPs;

  before(function (done) {
    // SC takes a **long** time.
    this.timeout(60000);

    connect({
      username: rowdy.config.setting.host,
      accessKey: rowdy.config.setting.key,
      verbose: true
    }, function (err, ps) {
      if (err) { return done(err); }
      // Stash process.
      connectPs = ps;

      // Patch settings
      //obj.desiredCapabilities.tunnelIdentifier =

      done();
    });
  });

  after(function (done) {
    if (connectPs) {
      this.timeout(30000);
      return connectPs.close(done);
    }

    done();
  });
}

// ----------------------------------------------------------------------------
// Selenium (Webdriverio/Rowdy) initialization
// ----------------------------------------------------------------------------
// **Note** Can stash adapter, but not `adapter.client` because it is a lazy
// getter that relies on the global `before|beforeEach` setup.
var adapter = global.adapter;
var ELEM_WAIT = isSauceLabs ? 5000 : 500; // Global wait.

adapter.before();
before(function (done) {
  if (isSauceLabs) { this.timeout(20000); }
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
