"use strict";

/**
 * Run multiple commands concurrently.
 *
 * Usage:
 *
 *    node test/util/run-concurrent.js "npm run test-func" "[ {ENV_VARS1}, {ENV_VARS2} ]"
 */
var _ = require("lodash");
var async = require("async");
var kill = require("tree-kill");
var spawn = require("child_process").spawn;

// Parse argv.
var args = process.argv;
if (args.length !== 4) {
  throw new Error("requires two arguments: [command] [ENV_VARS_ARRAY]");
}

// Get the arguments.
// Command: Assume splitable on space. (VERY NAIVE).
var cmdParts = args[2].split(" ");
var cmd = cmdParts[0];
var cmdFlags = _.rest(cmdParts);
var envObjs = JSON.parse(args[3]);

// Track the processes.
var procs = [];

// Let's go parallel!
async.map(envObjs, function (env, cb) {
  var err;

  var proc = spawn(cmd, cmdFlags, {
    stdio: "inherit",
    env: _.merge({}, process.env, env)
  });

  proc.on("close", function (code) {
    if (!err && code !== 0) {
      err = new Error(
        "non-zero exit of " + args[2] +
        " w/ env: " + JSON.stringify(env) +
        " w/ code: " + code);

      err.code = code;
    }

    cb(err);
  });

  procs.push(proc);
}, function (err) {
  if (err) {
    // Kill all existing procs.
    async.map(procs, function (proc, cb) {
      kill(proc.pid, "SIGKILL", cb);
    }, function (killErr) {
      throw killErr || err;
    });
  }
});
