Test
====

Loaders are fickle beasts. We test the heck out of them and the RequirePack
interop layer.

### Development

First, do the test build, then run tests:

```
$ npm run test-build
$ npm run test-func
```

After a `test-build` you can also run the test server:

```
$ npm run server
```

in a separate terminal, and then navigate to and `dist/*.html` scenario page
to see the bundled loaders (baseline, RequirePack) in action. For example,
to try out the `simple-amd` scenarios, navigate to:
[http://127.0.0.1:3001/test/func/simple-amd/dist/]()

### Scenarios

We test various build / source file scenarios in `test/func` as follows:

* [`simple-amd`](test/func/simple-amd): The most basic scenario. AMD, two entry
  points, one shared library and no external dependencies.

### Functional Tests

Our functional tests are set up as follows:

```
src/                          # Source JS files
spec/                         # Tests

build/
  requirejs/                  # RequireJS intermediate build files
dist/
  requirejs/                  # RequireJS built files
  webpack/                    # Webpack built files
  requirepack/                # RequirePack interop
  requirejs-baseline-*.html   # RequireJS baseline pages
  webpack-baseline.html       # Webpack baseline page
  requirepack-*.html          # RequirePack test pages

build.js                      # File builder
requirejs.*.js                # RequireJS configuration
webpack.*.js                  # Webpack configuration
```

Tests are broken down into:

* **Baseline**: These just run vanilla RequireJS / Webpack without interop to
  check that the tests honestly reflect a pure shared-library scenario. They
  are also very useful for debugging loader runtimes and seeing how all the
  moving parts work.
* **Actual Tests**: Check that RequirePack interop is actually working.
