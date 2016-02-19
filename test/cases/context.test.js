"use strict";

var expect = require("chai").expect;

module.exports = [
    function () {
        var window = global.window = {};

        expect(
            require("../../lib/index.js!../fixtures/commonJs.js").this()
        ).to.eql(window);
    },
    function () {
        expect(
            require("../../lib/index.js?context=null!../fixtures/commonJs.js").this()
        ).to.eql(null);
    },
    function () {
        var self = require("../../lib/index.js?context=module.exports!../fixtures/commonJs.js").this();

        expect(
            Object.keys(self).sort()
        ).to.eql(
            ["this", "module", "define", "window"].sort()
        );
    }
];
