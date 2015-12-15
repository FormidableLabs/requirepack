Development
===========

We use [builder][] and `npm` to control all aspects of development and
publishing.

As a preliminary matter, please update your shell to include
`./node_modules/.bin` in `PATH` like:

```sh
export PATH="${PATH}:./node_modules/.bin"
```

So you can type `builder` instead of `./node_modules/.bin/builder` for all
commands.


## Quality

We have various development / CI / coverage helper tasks.

For the overall quality check, run:

```sh
$ builder run check     # PhantomJS only
$ builder run check-ci  # (OR) PhantomJS w/ coverage
```

Which is currently comprised of:

```sh
$ builder run lint  # AND ...

$ builder run test      # PhantomJS only
$ builder run test-ci   # (OR) PhantomJS w/ coverage
```

Note that `(test|check)-(cov|ci)` run code coverage and thus the
test code may be harder to debug because it is instrumented.

### Parallel Execution

Our CI is setup with a specific optimized parallel workflow. To run parallel
functional tests in development, here are some helper tasks...

#### Local Browsers

Run parallel functional tests on local browsers:

```sh
$ TEST_PARALLEL=true \
  builder envs test-func-local \
  --setup=setup-local \
  --buffer \
  '[ { "ROWDY_SETTINGS":"local.phantomjs" },
     { "ROWDY_SETTINGS":"local.firefox" },
     { "ROWDY_SETTINGS":"local.chrome" }
   ]'
```

Notes:

* The `TEST_PARALLEL` environment variable signals to _not_ have Rowdy start up
  selenium and a local dev. server, which is done instead by `setup-local`.
* The `--buffer` flag stores all parallel output and displays individually as
  each test task exits for easier comprehensibility.
* There is a small delay inserted in each task in `test-func-local` to give
  time for the selenium server to start up.

For a faster, iterative version, use two terminals:

```sh
# First terminal: Leave persistent tasks running.
$ builder run setup-local

# Second terminal: Run tests (and repeat)
$ TEST_PARALLEL=true \
  builder envs test-func \
  --buffer \
  '[ { "ROWDY_SETTINGS":"local.phantomjs" },
     { "ROWDY_SETTINGS":"local.firefox" },
     { "ROWDY_SETTINGS":"local.chrome" }
   ]'
```

#### Sauce Labs

Run parallel functional tests in Sauce Labs:

```sh
$ TEST_PARALLEL=true \
  TEST_FUNC_PORT=3030 \
  TEST_FUNC_HOST=127.0.0.1 \
  SAUCE_USERNAME=<INSERT_USERNAME> \
  SAUCE_ACCESS_KEY=<INSERT_ACCESS_KEY> \
  builder envs test-func-sauce \
  --setup=setup-sauce \
  --buffer \
  '[ { "ROWDY_SETTINGS":"sauceLabs.IE_8_Windows_2008_Desktop" },
     { "ROWDY_SETTINGS":"sauceLabs.IE_9_Windows_2008_Desktop" },
     { "ROWDY_SETTINGS":"sauceLabs.IE_10_Windows_2012_Desktop" }
   ]'
```

Notes: This adds an even longer delay in `test-func-sauce` to account for the
relatively slow startup of Sauce Connect.

For a faster, iterative version, use two terminals:

```sh
# First terminal: Leave persistent tasks running.
$ builder run setup-sauce

# Second terminal: Run tests (and repeat)
$ TEST_PARALLEL=true \
  TEST_FUNC_PORT=3030 \
  TEST_FUNC_HOST=127.0.0.1 \
  SAUCE_USERNAME=<INSERT_USERNAME> \
  SAUCE_ACCESS_KEY=<INSERT_ACCESS_KEY> \
  builder envs test-func \
  --buffer \
  '[ { "ROWDY_SETTINGS":"sauceLabs.IE_8_Windows_2008_Desktop" },
     { "ROWDY_SETTINGS":"sauceLabs.IE_9_Windows_2008_Desktop" },
     { "ROWDY_SETTINGS":"sauceLabs.IE_10_Windows_2012_Desktop" }
   ]'
```

### Code Coverage

Code coverage reports are outputted to:

```
coverage/
  server|func/
    lcov-report/index.html  # Viewable web report.
```


## Releases

**IMPORTANT - NPM**: To correctly run `preversion` your first step is to make
sure that you have a very modern `npm` binary:

```sh
$ npm install -g npm
```

First, you can optionally edit and commit the project history.

```sh
$ vim HISTORY.md
$ git add HISTORY.md
$ git commit -m "Update history for VERSION"
```

Now we're ready to publish. Choose a semantic update for the new version.
If you're unsure, read about semantic versioning at http://semver.org/

```sh
$ npm version VERSION|major|minor|patch -m "Version %s - INSERT_REASONS"
```

Now `postversion` will push to git and publish to NPM.

[builder]: https://github.com/FormidableLabs/builder
