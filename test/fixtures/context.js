"use strict";

var self = this;

function getThis() {
    return self;
}

function getWindow() {
    return window;
}

window.getThis = getThis;
window.getWindow = getWindow;
