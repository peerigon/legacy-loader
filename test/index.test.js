"use strict";

var compile = require("./helpers/compile.js");

describe("legacy-loader", function () {

    describe("single exports", function () {
        var testRunner;

        before(function (done) {
            compile("single", function (err, result) {
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

    describe("multi exports", function () {
        var testRunner;

        before(function (done) {
            compile("multi", function (err, result) {
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

    describe("specific exports", function () {
        var testRunner;

        before(function (done) {
            compile("specific", function (err, result) {
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
