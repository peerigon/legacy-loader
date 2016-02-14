"use strict";

var sinon = require("sinon");

function loaderContextMock() {
    var mock = {
        query: "?exports=propertyA",
        cacheable: sinon.spy()
    };

    mock.loaders = [mock];

    return mock;
}

module.exports = loaderContextMock;
