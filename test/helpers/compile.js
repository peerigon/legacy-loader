"use strict";

var path = require("path");
var webpack = require("webpack");
var fs = require("fs");
var assign = require("object-assign");

var outputDir = path.resolve(__dirname, "../output");

function compile(testCase, options) {
    return new Promise(function (resolve, reject) {
        var defaultOptions = {
            entry: path.resolve(__dirname, "../cases/" + testCase  + ".test.js"),
            output: {
                path: outputDir,
                filename: testCase + ".js",
                libraryTarget: "commonjs2"
            }
        };

        webpack(assign(defaultOptions, options || {}, {}), function (err, stats) {
            err ? reject(err) : resolve(stats);
        });
    }).then(function (stats) {
        var pathToBundle = path.join(outputDir, testCase + ".js");

        if (stats.hasErrors() || stats.hasWarnings()) {
            throw new Error(stats.compilation.errors || stats.compilation.warnings);
        }

        delete require.cache[pathToBundle];

        return require(pathToBundle);
    });
}

try {
    fs.mkdirSync(outputDir);
} catch (e) {
    if (e.code !== "EEXIST") {
        throw e;
    }
}

module.exports = compile;
