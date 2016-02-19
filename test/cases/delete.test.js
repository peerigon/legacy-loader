"use strict";

var expect = require("chai").expect;

var testProperty = {};

module.exports = [
    function () {
        global.window = {
            testProperty: testProperty
        };
        require("../../lib/index.js?export=testProperty&delete=true!../fixtures/legacy.js");
        expect(global.window).to.not.have.property("testProperty");
    }
];
