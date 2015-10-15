"use strict";

/**
 * Wrap Mocha specs with retry logic.
 */
var _ = require("lodash");

module.exports = function (num, test) {
  var triesLeft = num - 1;
  var isAsync = test.length === 1; // Similar check as Mocha for async.

  // Async. Need actual arguments in function declaration!
  if (isAsync) {
    var retryAsync = function (err, done) {
      if (triesLeft > 0) {
        triesLeft--;
        return async(done);
      }
      done(err);
    };

    var async = function (done) {
      var error;
      try {
        test(function (err) {
          // Check if _also_ threw already and retrying.
          if (error) { return; }
          retryAsync(err, done);
        });
      } catch (err) {
        error = err;
        retryAsync(err, done);
      }
    };

    return async;
  }

  // Sync.
  var sync = function () {
    try {
      test();
    } catch (err) {
      if (triesLeft > 0) {
        triesLeft--;
        return sync();
      }
      throw err;
    }
  };

  return sync;
};
