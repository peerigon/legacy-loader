"use strict";

var loaderUtils = require("loader-utils");
var SourceNode = require("source-map").SourceNode;
var SourceMapConsumer = require("source-map").SourceMapConsumer;
var fs = require("fs");

var prepend = fs.readFileSync(__dirname + "/template/prepend.js", "utf8");
var append = fs.readFileSync(__dirname + "/template/append.js", "utf8");

module.exports = function (content, sourceMap) {
    var query = loaderUtils.parseQuery(this.query);
    var actualAppend = append;
    var exports = query.exports;
    var publish = query.publish;
    var currentRequest;
    var node;
    var result;

    if (this.cacheable) {
        this.cacheable();
    }

    if (exports) {
        exports = JSON.stringify(exports);
        actualAppend = [
            "}).call(windowShim, windowShim);",
            "module.exports = windowShim[" + exports + "];"
        ].join("\n");
    }
    if (publish) {
        publish = JSON.stringify(publish);
        actualAppend += "\n" + "window[" + publish + "] = windowShim[" + publish + "];";
    }

    if (sourceMap) {
        currentRequest = loaderUtils.getCurrentRequest(this);
        node = SourceNode.fromStringWithSourceMap(content, new SourceMapConsumer(sourceMap));
        node.prepend(prepend);
        node.add(actualAppend);
        result = node.toStringWithSourceMap({
            file: currentRequest
        });
        this.callback(null, result.code, result.map.toJSON());
        return;
    }
    return prepend + content + actualAppend;
};
