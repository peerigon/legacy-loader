"use strict";

var expect = require("chai").expect;
var window;
var exported;

module.exports = [
    function () {
        window = global.window = {};
        exported = require("../../lib/index.js?exports[]=propertyA&exports[]=propertyB!../fixtures/legacy.js");
    },
    function () {
        expect(exported).to.eql({
            propertyA: true,
            propertyB: true
        });
    }
];
