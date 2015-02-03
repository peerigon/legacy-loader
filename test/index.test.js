"use strict";

var compile = require("./helpers/compile.js");

describe("legacy-loader", function () {

    describe("singleExtend", function () {
        var testRunner;

        before(function (done) {
            compile("singleExtend", function (err, result) {
                if (err) {
                    done(err);
                    return;
                }
                testRunner = result;
                done();
            });
        });

        it("should run without errors", function () {
            testRunner(0);
        });

        it("should export an object with the given properties", function () {
            testRunner(1);
        });

        it("should not modify the global window object", function () {
            testRunner(2);
        });

    });

    describe("multiExtend", function () {
        var testRunner;

        before(function (done) {
            compile("multiExtend", function (err, result) {
                if (err) {
                    done(err);
                    return;
                }
                testRunner = result;
                done();
            });
        });

        it("should run without errors", function () {
            testRunner(0);
        });

        it("should export an object with the given properties", function () {
            testRunner(1);
        });

        it("should not modify the global window object", function () {
            testRunner(2);
        });

    });

    describe("namedExport", function () {
        var testRunner;

        before(function (done) {
            compile("namedExport", function (err, result) {
                if (err) {
                    done(err);
                    return;
                }
                testRunner = result;
                done();
            });
        });

        it("should run without errors", function () {
            testRunner(0);
        });

        it("should export the named property", function () {
            testRunner(1);
        });

        it("should not modify the global window object", function () {
            testRunner(2);
        });

    });

});
