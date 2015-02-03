"use strict";

var path = require("path");
var webpack = require("webpack");
var enhancedReqFactory = require("enhanced-require");
var fs = require("fs");

var outputDir = path.resolve(__dirname, "../output");

function compile(testCase, done) {
    var testCaseFile = path.resolve(__dirname, "../cases/" + testCase  + ".test.js");
    var result = {};
    var enhancedReq;

    enhancedReq = enhancedReqFactory(module);

    // run synchronously
    result.enhancedReq = enhancedReq(testCaseFile);

    // run asynchronously
    webpack({
        entry: testCaseFile,
        output: {
            path: outputDir,
            filename: "bundle.js",
            libraryTarget: "commonjs2"
        }
    }, function onCompilationFinished(err, stats) {
        var pathToBundle = path.join(outputDir, "bundle.js");

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

        result.webpack = require(pathToBundle);

        done(null, function testRunner(testNumber) {
            result.enhancedReq[testNumber]();
            result.webpack[testNumber]();
        });
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
