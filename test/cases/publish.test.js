"use strict";

var expect = require("chai").expect;
var window;
var exported;

module.exports = [
    function () {
        window = global.window = {};
        require("../../lib/index.js?publish=propertyB!../fixtures/legacyMulti.js");
    },
    function () {
        expect(window.propertyB).to.equal(true);
    },
    function () {
        expect("propertyA" in window).to.equal(false);
    }
];
