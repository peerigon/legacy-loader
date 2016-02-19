"use strict";

var expect = require("chai").expect;

var testProperty = {};
var exported;

module.exports = [
    function () {
        global.window = {
            testProperty: testProperty
        };
        exported = require("../../lib/index.js?export=testProperty&delete=true!../fixtures/legacy.js");
        expect(global.window).to.not.have.property("testProperty");
    }
];
