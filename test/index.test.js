"use strict";

var compile = require("./helpers/compile.js");
var chai = require("chai");
var expect = chai.expect;
var loader = require("../lib/index.js");
var sinon = require("sinon");
var fs = require("fs");
var path = require("path");
var sourceMap = require("source-map");

chai.use(require("sinon-chai"));

describe("legacy-loader", function () {
    var testModule;

    function compileTestModule(options) {
        return function () {
            return compile(options)
                .then(function (compiled) {
                    testModule = compiled;
                });
        };
    }

    function test(n) {
        return function () {
            testModule[n]();
        };
    }

    describe("export", function () {

        before(compileTestModule("export"));

        it("should export the given property from the window object", test(0));

    });

    describe("context", function () {

        before(compileTestModule("context"));

        it("should inject window as this by default", test(0));
        it("should be possible to inject null as this", test(1));
        it("should be possible to inject module.exports as this", test(2));

    });

    describe("delete", function () {

        before(compileTestModule("delete"));

        it("should delete the exported property from window", test(0));
        it("should throw an error if delete is used without an export property", function () {
            return compile("deleteWithoutExport")
                .then(function () {
                    throw new Error("Expected to throw an error");
                })
                .catch(function (err) {
                    expect(err.message).to.contain("Don't know which property to delete from window: The delete option is only available in combination with the export option");
                });
        });

    });

    describe("delete", function () {

        before(compileTestModule("delete"));

        it("should delete the exported property from window", test(0));
        it("should throw an error if delete is used without an export property", function () {
            return compile("deleteWithoutExport")
                .then(function () {
                    throw new Error("Expected to throw an error");
                })
                .catch(function (err) {
                    expect(err.message).to.contain("Don't know which property to delete from window: The delete option is only available in combination with the export option");
                });
        });

    });

    describe("hide", function () {

        before(compileTestModule("hide"));

        it("should hide the window variable", test(0));
        it("should hide the module system", test(1));

    });

    describe("modules with return statements on top level", function () {

        it("should throw no parsing error", function () {
            return compile("return");
        });

    });

    describe("cacheable", function () {
        var mock;

        it("should flag the module as cacheable", function () {
            mock = {
                cacheable: sinon.spy()
            };

            loader.call(mock, "");

            expect(mock.cacheable).to.have.been.called;
        });

    });

    describe("source maps", function () {

        ["sourceMapSimple", "sourceMapChained"].forEach(function (testCase) {

            it("should output a proper source map if requested (" + testCase + ")", function () {
                return compile(testCase, {
                    devtool: "sourcemap"
                }).then(function () {
                    var consumer = new sourceMap.SourceMapConsumer(JSON.parse(fs.readFileSync(
                        path.join(__dirname, "output", testCase + ".js.map"),
                        "utf8"
                    )));
                    var expectedSrc = '"hello";';
                    var file = consumer.sources.filter(function (filename) {
                        return filename.match(/hello\.js$/);
                    })[0];
                    var actualSrc = consumer.sourceContentFor(file);

                    // We need to slice off the auto generated webpack footer
                    actualSrc = actualSrc.slice(0, expectedSrc.length);

                    expect(actualSrc).to.equal(expectedSrc);
                });
            });

        });

    });

});
