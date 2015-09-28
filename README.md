[![Travis Status][trav_img]][trav_site]

RequirePack
===========

[Webpack][webpack] + [RequireJS][requirejs] shared library interoperability!

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

**TODO: DOCUMENT**

### Shared Libraries Deep Dive

Going a little deeper, let's create a very simple example using AMD:

```js
// foo.js
define([], function () {
  return "I am foo!";
});

// lib.js
define(["./foo"], function () {});

// app1.js
define(["./foo"], function (foo) {
  console.log("app1", foo);
});

// app2.js
define(["./foo"], function (foo) {
  console.log("app2", foo);
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
    exclude: ["lib"]
  },
  {
    name: "app2",
    exclude: ["lib"]
  }
]
```

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

[webpack]: http://webpack.github.io/
[wp-dll]: https://github.com/webpack/webpack/tree/master/examples/dll
[wp-dll-user]: https://github.com/webpack/webpack/tree/master/examples/dll-user
[requirejs]: http://requirejs.org/
[rjs-exclude]: https://github.com/jrburke/r.js/blob/master/build/example.build.js#L388-L398
[trav_img]: https://api.travis-ci.org/FormidableLabs/requirepack.svg
[trav_site]: https://travis-ci.org/FormidableLabs/requirepack
