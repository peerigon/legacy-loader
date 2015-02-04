"use strict";

var expect = require("chai").expect;
var window;
var exported;

module.exports = [
    function () {
        window = global.window = {};
        exported = require("../../lib/index.js!../fixtures/legacySingle.js");
    },
    function () {
        expect(exported).to.equal(true);
    },
    function () {
        expect("propertyA" in window).to.equal(false);
    }
];
