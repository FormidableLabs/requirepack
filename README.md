RequirePack
===========

[Webpack][webpack] + [RequireJS][requirejs] shared library interoperability!

[![Travis Status][trav_img]][trav_site]
[![Coverage Status][cov_img]][cov_site]

[![Sauce Test Status][sauce_img]][sauce_site]

Webpack and RequireJS both can consume AMD code straight up. Which means if you
are in a transitional / complex scenario where you want _some_ code to load
with Webpack and _other_ code to load with RequireJS from the same code base
you can!

And, Webpack and RequireJS both have facilities for sharing libraries across
entry points. Unfortunately, if loading both RequireJS and Webpack entry points
on the same page, the applications cannot natively use the **same** shared
library.

RequirePack bridges this gap by providing an interopability layer to allow a
Webpack-generated shared library to be consumaed by RequireJS entry points.

### Getting Started

Install:

```sh
$ npm install --save requirepack
```

Configure:

**`TODO(8): Document Configuration`**

### Development

Ports various servers run on:

* [`3001`](http://127.0.0.1:3001/): Static / demo server.
* [`3030`](http://127.0.0.1:3030/): Ephemeral server for functional tests.
  Override via `TEST_FUNC_PORT` environment variable.

### Topics

* **[Shared Libraries](docs/shared-libraries.md)**: A deep dive into how shared
  libraries work in RequireJS, Webpack and are bridged with RequirePack.
* **[Tests](docs/test.md)**: Our test suite encompasses a lot of different types
  of builds that are likely to be encountered, running demos, and


[webpack]: http://webpack.github.io/
[wp-dll]: https://github.com/webpack/webpack/tree/master/examples/dll
[wp-dll-user]: https://github.com/webpack/webpack/tree/master/examples/dll-user
[requirejs]: http://requirejs.org/
[rjs-exclude]: https://github.com/jrburke/r.js/blob/master/build/example.build.js#L388-L398
[trav_img]: https://api.travis-ci.org/FormidableLabs/requirepack.svg
[trav_site]: https://travis-ci.org/FormidableLabs/requirepack
[sauce]: https://saucelabs.com
[sauce_img]: https://saucelabs.com/browser-matrix/requirepack.svg
[sauce_site]: https://saucelabs.com/u/requirepack
[cov]: https://coveralls.io
[cov_img]: https://img.shields.io/coveralls/FormidableLabs/requirepack.svg
[cov_site]: https://coveralls.io/r/FormidableLabs/requirepack
