"use strict";

exports.this = function () {
    return this;
}.bind(this);

exports.module = function () {
    return module;
};

exports.define = function () {
    return define;
};

exports.window = function () {
    return window;
};
