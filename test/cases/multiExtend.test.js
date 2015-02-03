"use strict";

var expect = require("chai").expect;
var window;
var exported;

module.exports = [
    function () {
        window = global.window = {};
        exported = require("../../lib/index.js!../fixtures/multiExtend.js");
    },
    function () {
        expect(exported).to.eql({
            propertyA: true,
            propertyB: true
        });
    },
    function () {
        expect("propertyA" in window).to.equal(false);
        expect("propertyB" in window).to.equal(false);
    }
];
