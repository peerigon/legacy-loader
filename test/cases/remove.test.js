"use strict";

var expect = require("chai").expect;
var window;

module.exports = [
    function () {
        window = global.window = {};
        require("../../lib/index.js?exports=propertyA!../fixtures/legacy.js");
        expect(window.propertyA).to.equal(true);
        expect(window.propertyB).to.equal(true);
    },
    function () {
        window = global.window = {};
        require("../../lib/index.js?exports=propertyA&remove!../fixtures/legacy.js");
        expect("propertyA" in window).to.equal(false);
        expect(window.propertyB).to.equal(true);
    },
    function () {
        window = global.window = {};
        require("../../lib/index.js?exports=propertyA&remove[]=propertyA&remove[]=propertyB!../fixtures/legacy.js");
        expect("propertyA" in window).to.equal(false);
        expect("propertyB" in window).to.equal(false);
    },
    function () {
        window = global.window = {};
        require("../../lib/index.js?exports[]=propertyA&exports[]=propertyB&remove!../fixtures/legacy.js");
        expect("propertyA" in window).to.equal(false);
        expect("propertyB" in window).to.equal(false);
    },
    function () {
        window = global.window = {};
        require("../../lib/index.js?remove=propertyA!../fixtures/legacy.js");
        expect("propertyA" in window).to.equal(false);
        expect(window.propertyB).to.equal(true);
    }
];
