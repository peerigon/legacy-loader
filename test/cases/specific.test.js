"use strict";

var expect = require("chai").expect;
var window;
var exported;

module.exports = [
    function () {
        window = global.window = {};
        exported = require("../../lib/index.js?exports=propertyB!../fixtures/legacyMulti.js");
    },
    function () {
        expect(exported).to.equal(false);
    },
    function () {
        expect("propertyA" in window).to.equal(false);
        expect("propertyB" in window).to.equal(false);
    }
];
