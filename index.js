"use strict";

var loaderUtils = require("loader-utils");
var SourceNode = require("source-map").SourceNode;
var SourceMapConsumer = require("source-map").SourceMapConsumer;

module.exports = function (content, sourceMap) {
    var query = loaderUtils.parseQuery(this.query);
    var prepend = [];
    var append = [];
    var exports = query.exports;
    var shimWindow = query.shimWindow === undefined? true : query.shimWindow;
    var currentRequest;
    var node;
    var result;

    if (this.cacheable) {
        this.cacheable();
    }

    prepend.push("var windowShim = " + (shimWindow? "Object.create(window)" : "window") + ";");
    prepend.push("module.exports = (function (window, module, exports, define) {");
    append.unshift("}).call(windowShim, windowShim);");

    if (exports) {
        if (Array.isArray(exports)) {
            exports = "{ " + exports.map(function (key) {
                key = JSON.stringify(key);
                return key + ": window[" + key + "]";
            }) + " }";
        } else {
            "window[" + JSON.stringify(exports) + "]";
        }
        append.unshift("\n;return " + exports + ";");
    }

    prepend = prepend.join("\n") + "\n";
    append = append.join("\n");

    if (sourceMap) {
        currentRequest = loaderUtils.getCurrentRequest(this);
        node = SourceNode.fromStringWithSourceMap(content, new SourceMapConsumer(sourceMap));
        node.prepend(prepend);
        node.add(append);
        result = node.toStringWithSourceMap({
            file: currentRequest
        });
        this.callback(null, result.code, result.map.toJSON());
        return;
    }
    return prepend + content + append;
};
