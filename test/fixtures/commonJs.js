"use strict";
/* global define, window */

exports.this = function () {
    return this;
}.bind(this); // eslint-disable-line no-invalid-this

exports.module = function () {
    return module;
};

exports.define = function () {
    return define;
};

exports.window = function () {
    return window;
};
