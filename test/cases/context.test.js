"use strict";

var expect = require("chai").expect;
var window;
var exported;

module.exports = [
    function () {
        window = global.window = {};
        exported = require("../../lib/index.js?exports[]=getThis&exports[]=getWindow!../fixtures/context.js");
        expect(exported.getThis()).to.eql(exported.getWindow());
    }
];
