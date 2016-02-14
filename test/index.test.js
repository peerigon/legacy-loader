"use strict";

var compile = require("./helpers/compile.js");
var chai = require("chai");
var expect = chai.expect;
var loaderContextMock = require("./helpers/loaderContextMock.js");
var loader = require("../lib/index.js");

chai.use(require("sinon-chai"));

describe("legacy-loader", function () {

    describe("single exports", function () {
        var testRunner;

        before(function (done) {
            compile("single", function (err, result) {
                if (err) {
                    done(err);
                    return;
                }
                testRunner = result.testRunner;
                done();
            });
        });

        it("should run without errors", function () {
            testRunner(0);
        });

        it("should export the requested property", function () {
            testRunner(1);
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
                testRunner = result.testRunner;
                done();
            });
        });

        it("should run without errors", function () {
            testRunner(0);
        });

        it("should export an object with the requested properties", function () {
            testRunner(1);
        });

    });

    describe("remove properties from window object", function () {
        var testRunner;

        before(function (done) {
            compile("remove", function (err, result) {
                if (err) {
                    done(err);
                    return;
                }
                testRunner = result.testRunner;
                done();
            });
        });

        it("should not prevent the script from extending the window object by default", function () {
            testRunner(0);
        });

        describe("single export and implicit remove", function () {

            it("should remove the exported property only", function () {
                testRunner(1);
            });

        });

        describe("single export and explicit remove", function () {

            it("should remove the given properties", function () {
                testRunner(2);
            });

        });

        describe("multi export and implicit remove", function () {

            it("should remove all exported properties", function () {
                testRunner(3);
            });

        });

        describe("no export and explicit remove", function () {

            it("should remove the given properties", function () {
                testRunner(4);
            });

        });

    });

    describe("context", function () {
        var testRunner;

        before(function (done) {
            compile("context", function (err, result) {
                if (err) {
                    done(err);
                    return;
                }
                testRunner = result.testRunner;
                done();
            });
        });

        it("should init the module with the window as context", function () {
            testRunner(0);
        });

    });

    describe("errors", function () {

        it("should throw an error when neither exports nor remove is specified", function (done) {
            compile("noExportsAndRemove", function (err) {
                expect(err).to.be.an("object");
                expect(err.message).to.equal("Neither exports nor remove parameter specified. You need at least one.");
                done();
            });
        });

        it("should throw an error when implicit remove is without an export parameter", function (done) {
            compile("implicitRemoveWithoutExports", function (err) {
                expect(err).to.be.an("object");
                expect(err.message).to.equal("Implicit remove without an export parameter is not possible.");
                done();
            });
        });
    });

    describe("cacheable", function () {
        var mock;

        it("should flag the module as cacheable", function () {
            mock = loaderContextMock();

            loader.call(mock, "");

            expect(mock.cacheable).to.have.been.called;
        });

    });

    describe("source maps", function () {
        var mock;

        it("should return a proper source map if requested", function (done) {
            mock = loaderContextMock();

            mock.callback = function (err, result, sourceMap) {
                if (err) {
                    return done(err);
                }
                console.log(sourceMap);
                done(err);
            };

            loader.call(mock, "", true);
        });

    });

});
