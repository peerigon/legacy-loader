"use strict";

var expect = require("chai").expect;

var testProperty = {};
var exported;

module.exports = [
    function () {
        global.window = {
            testProperty: testProperty
        };
        exported = require("../../lib/index.js?export=testProperty!../fixtures/legacy.js");
        expect(exported).to.equal(testProperty);
    }
];
