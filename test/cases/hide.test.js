"use strict";

var expect = require("chai").expect;

module.exports = [
    function () {
        expect(
            require("../../lib/index.js?hide=window!../fixtures/commonJs.js").window()
        ).to.equal(undefined);
    },
    function () {
        var exported = require("../../lib/index.js?hide[]=module&hide[]=define!../fixtures/commonJs.js");

        expect(exported.module()).to.equal(undefined);
        expect(exported.define()).to.equal(undefined);
    }
];
