"use strict";

var expect = require("chai").expect;
var window;
var exported;

module.exports = [
    function () {
        window = global.window = {};
        exported = require("../../lib/index.js?exports=propertyA&publish=propertyB!../fixtures/legacyMulti.js");
    },
    function () {
        expect(exported).to.equal(true);
    },
    function () {
        expect(window.propertyB).to.equal(false);
    },
    function () {
        expect("propertyA" in window).to.equal(false);
    }
];
