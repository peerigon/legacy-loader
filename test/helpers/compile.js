"use strict";

var path = require("path");
var webpack = require("webpack");
var enhancedReqFactory = require("enhanced-require");
var fs = require("fs");

var outputDir = path.resolve(__dirname, "../output");

function compile(testCase, done) {
    var testCaseFile = path.resolve(__dirname, "../cases/" + testCase  + ".test.js");
    var result = {
        enhancedRequire: null,
        webpack: null
    };
    var enhancedReq;

    enhancedReq = enhancedReqFactory(module);

    // run synchronously
    try {
        result.enhancedReq = enhancedReq(testCaseFile);
    } catch (err) {
        return done(err);
    }

    // run asynchronously
    webpack({
        entry: testCaseFile,
        devtool: "sourcemap",
        output: {
            path: outputDir,
            filename: testCase + ".js",
            libraryTarget: "commonjs2"
        }
    }, function onCompilationFinished(err, stats) {
        var pathToBundle = path.join(outputDir, testCase + ".js");

        if (err) {
            return done(err);
        }
        if (stats.hasErrors()) {
            return done(stats.compilation.errors[0]);
        }
        if (stats.hasWarnings()) {
            return done(stats.compilation.warnings[0]);
        }
        delete require.cache[pathToBundle];

        try {
            result.webpack = require(pathToBundle);
        } catch (err) {
            return done(err);
        }

        result.testRunner = function testRunner(testNumber) {
            result.enhancedReq[testNumber]();
            result.webpack[testNumber]();
        };

        done(null, result);
    });
}

try {
    fs.mkdirSync(outputDir);
} catch (e) {
    if (!e || e.code !== "EEXIST") {
        throw e;
    }
}

module.exports = compile;
