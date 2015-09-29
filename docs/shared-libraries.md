Shared Libraries
================

Going a little deeper, let's create a very simple example using AMD:

```js
// foo.js
define([], function () {
  return function (id, msg) {
    return "<h1 id=\"" + id + "\">" + msg + "</h1>";
  };
});

// lib.js
define(["./foo"], function () {});

// app1.js
define(["./foo"], function (foo) {
  document.querySelector("#content").innerHTML += foo("app1", "App 1");
});

// app2.js
define(["./foo"], function (foo) {
  document.querySelector("#content").innerHTML += foo("app2", "App 2");
});
```

We want to build our JS such that our bundles look like:

* `lib.js`: Contains `lib.js` and `foo.js` (the shared components).
* `app1.js`: Contains **only** `app1.js`
* `app2.js`: Contains **only** `app2.js`

... and now let's see how we accomplish this in two different builders.

#### RequireJS

For RequireJS, this is simply configured by [excluding][rjs-exclude] the shared
library from the application entry points. So, in a build configuration, this
would look something like:

```js
// requirejs.build.js
modules: [
  // Shared library module. Includes `lib.js` and `foo.js`
  {
    name: "lib"
  },
  // Application entry points. Exclude `lib.js` and `foo.js`
  {
    name: "app1",
    exclude: ["lib"],
    insertRequire: ["app1"]
  },
  {
    name: "app2",
    exclude: ["lib"],
    insertRequire: ["app2"]
  }
]
```

This translates to the following built files:

```
// lib.js
define("foo", /* foo.js source */);
define(["./foo"], function () {});

// app1.js
define("app1", ["./foo"], /* app1.js source */);

// app2.js
define("app2", ["./foo"], /* app2.js source */);
```

The RequireJS scheme is quite simple:

* `lib.js` calls many `define()` statements first.
* Anything `define()`'ed in `lib.js` does not need to be defined in `app*.js`

So as long as _something, anything_ calls a `define` before `app*.js` is loaded,
then those files can be omitted from the `app*.js` bundle.

### Webpack

For Webpack, we use the [`dll`][wp-dll] and [`dll-user`][wp-dll-user] plugins.
The build configuration is a bit more complicated, with separate files for
the shared library and the application entry points:

```js
// webpack.config.lib.js
module.exports = {
  entry: {
    lib: ["./lib"]
  },
  output: {
    path: path.join(__dirname, "dist/webpack"),
    filename: "[name].js",
    library: "[name]_[hash]"
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "dist/webpack/[name]-manifest.json"),
      name: "[name]_[hash]"
    })
  ]
};

// webpack.config.app.js
module.exports = {
  entry: {
    app1: "./app1.js",
    app2: "./app2.js"
  },
  output: {
    path: path.join(__dirname, "dist/webpack"),
    filename: "[name].js"
  },
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require("./dist/webpack/lib-manifest.json")
    })
  ]
};
```


This translates to the following built files:

```
// lib.js
/* Webpack loader boilerplate */
([
  /* 0 */ function(module, exports, __webpack_require__) {
    /* The `require` function */
  },
  /* 1 */ function(module, exports, __webpack_require__) {
    /* lib.js source */
  },
  /* 2 */function(module, exports, __webpack_require__) {
    /* foo.js source */
  }}
]);

// lib-manifest.json
{
  "name": "lib_b9c7be1ffce70ccbda4d",
  "content": {
    "./lib.js": 1,
    "./foo.js": 2
  }
}

// app1.js
/* Webpack loader boilerplate */
([
  /* 0 */ function(module, exports, __webpack_require__) {
    /* app1.js source */
  },
  /* 1 */ function(module, exports, __webpack_require__) {
    /* foo import from lib.js. foo is `2` in lib, lib.js is `2` here. */
    module.exports = (__webpack_require__(2))(2);
  },
  /* 2 */function(module, exports, __webpack_require__) {
    /* lib.js link via global variable */
    module.exports = lib_b9c7be1ffce70ccbda4d;
  }}
]);

// app2.js
/* Webpack loader boilerplate */
([
  /* 0 */ function(module, exports, __webpack_require__) {
    /* app2.js source */
  },
  /* 1 */ function(module, exports, __webpack_require__) {
    /* foo import from lib.js. foo is `2` in lib, lib.js is `2` here. */
    module.exports = (__webpack_require__(2))(2);
  },
  /* 2 */function(module, exports, __webpack_require__) {
    /* lib.js link via global variable */
    module.exports = lib_b9c7be1ffce70ccbda4d;
  }}
]);
```

Webpack takes a much more terse approach, eschewing a string namespace and
instead using array indexes for references. This is a little more complicated
for sharing libraries across builds because the build indexes are not uniquely
identifying of resources.

To accomodate this indirect, Webpack creates a manifest JSON file that
translates a namespace to lookup index. Above, we have the following indirection
scheme:

```
// lib.js
0: `require` function
1: `lib.js` source
2: `foo.js` source

// app1.js
0: `app1.js` source
1: app1(2)(2) -> lib(2) -> `foo.js` **link**
2: `lib` bundle **link**

// app2.js
0: `app2.js` source
1: app2(2)(2) -> lib(2) -> `foo.js` **link**
2: `lib` bundle **link**
```

[webpack]: http://webpack.github.io/
[wp-dll]: https://github.com/webpack/webpack/tree/master/examples/dll
[wp-dll-user]: https://github.com/webpack/webpack/tree/master/examples/dll-user
[requirejs]: http://requirejs.org/
[rjs-exclude]: https://github.com/jrburke/r.js/blob/master/build/example.build.js#L388-L398
[trav_img]: https://api.travis-ci.org/FormidableLabs/requirepack.svg
[trav_site]: https://travis-ci.org/FormidableLabs/requirepack