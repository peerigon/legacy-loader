legacy-loader
=============
**[Webpack](http://webpack.github.io/) loader that prevents scripts from extending the window object**

[![Build Status](https://travis-ci.org/peerigon/legacy-loader.svg?branch=master)](https://travis-ci.org/peerigon/legacy-loader)
[![Dependency Status](https://david-dm.org/peerigon/legacy-loader.svg)](https://david-dm.org/peerigon/legacy-loader)
[![Coverage Status](https://img.shields.io/coveralls/peerigon/legacy-loader.svg)](https://coveralls.io/r/peerigon/legacy-loader?branch=master)

Use this loader to cope with legacy scripts that extend the window object instead of using AMD or CommonJS.

<br />

Installation
------------

[![npm status](https://nodei.co/npm/legacy-loader.svg?downloads=true&stars=true)](https://npmjs.org/package/legacy-loader)

<br />

Usage
-----

### Basic example

Imagine you've downloaded `some-legacy-script` from npm which looks like

```javascript
window.someLegacyScript = function () {
    console.log("Yay!");
};
```

Now just run `npm i legacy-loader --save` and configure your `webpack.config.js` like this

```javascript
module.exports = {
    module: {
        loaders: [
            {
                test: /[\/\\]node_modules[\/\\]some-legacy-script[\/\\]index\.js$/,
                loader: "legacy"
            }
        ]
    }
};
```

then you can do

```javascript
var someLegacyScript = require("some-legacy-script");

someLegacyScript(); // prints 'Yay!'
window.someLegacyScript; // undefined
```

### Auto export

The **legacy-loader** exports a single value via `module.exports` when your legacy script did only add one
property to the window object. If it added two or more, an object is returned instead:

```javascript
// node_modules/some-legacy-script/index.js

window.propertyA = true;
window.propertyB = false;
```

```javascript
// app.js

var someLegacyScript = require("some-legacy-script");

someLegacyScript.propertyA; // true
someLegacyScript.propertyB; // false

window.propertyA; // undefined
window.propertyB; // undefined
```

### Specific exports

When your legacy script adds two or more properties, but you're still just interested in one particular property,
you can also pass a property name:

```javascript
// webpack.config.js

    ...
    {
        test: /[\/\\]node_modules[\/\\]some-legacy-script[\/\\]index\.js$/,
        loader: "legacy?exports=propertyA"
    }
    ...
```

```javascript
// app.js

var someLegacyScript = require("some-legacy-script");

someLegacyScript; // true -> propertyA
```

### Publish

Sometimes other libraries are relying on a particular global variable (like jQuery plugins rely on `$`). Then you should
first consider using the [imports-loader](https://github.com/webpack/imports-loader) to inject that variable into the
private module scope. If this is not an option for you (e.g. because you're not loading this module via webpack),
you can decide to publish a single property back to the window object.

```javascript
// webpack.config.js

    ...
    {
        test: /[\/\\]node_modules[\/\\]some-legacy-script[\/\\]index\.js$/,
        loader: "legacy?publish=propertyB"
    }
    ...
```

```javascript
// app.js

var someLegacyScript = require("some-legacy-script");

someLegacyScript.propertyA; // true
someLegacyScript.propertyB; // false

window.propertyA; // undefined
window.propertyB; // false
```

<br />

Under the hood
--------------

The **legacy-loader** creates a window shim by inheriting from window via `Object.create(window)`. Thus the
legacy script receives a window-like object, without being able to extend it. Of course, this approach has
the usual limitations implied by the prototype inheritance (such as iterating over `window` while checking for
`hasOwnProperty`).

<br />

Contributing
------------

From opening a bug report to creating a pull request: **every contribution is appreciated and welcome**. If you're planing to implement a new feature or change the api please create an issue first. This way we can ensure that your precious work is not in vain.

All pull requests should have 100% test coverage (with notable exceptions) and need to pass all tests.

- Call `npm test` to run the unit tests
- Call `npm run coverage` to check the test coverage (using [istanbul](https://github.com/gotwarlost/istanbul))

<br />

License
-------

Unlicense
