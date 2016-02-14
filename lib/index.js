"use strict";

var loaderUtils = require("loader-utils");
var SourceNode = require("source-map").SourceNode;
var SourceMapConsumer = require("source-map").SourceMapConsumer;
var fs = require("fs");
var ejs = require("ejs");
var os = require("os");

var wrapperPrepend = "(function (window, module, exports, define) {" + os.EOL;
var wrapperAppend = os.EOL + "}).call(window, window);" + os.EOL;
var appendTemplate = ejs.compile(fs.readFileSync(__dirname + "/append.ejs", "utf8"));

module.exports = function (content, sourceMap) {
    var query = loaderUtils.parseQuery(this.query);
    var renderData = {
        exports: undefined,
        multi: undefined,
        removes: undefined
    };
    var exports = query.exports;
    var remove = query.remove;
    var multi = Array.isArray(exports);
    var prepend = wrapperPrepend;
    var append = wrapperAppend;
    var currentRequest;
    var node;
    var result;

    this.cacheable();

    if (!exports) {
        if (!remove) {
            // It makes no sense to use this loader when both parameters are not set.
            // This is likely an error, so lets throw one.
            throw new Error("Neither exports nor remove parameter specified. You need at least one.");
        }
        if (remove === true) {
            // It also makes no sense to use an implicit remove when no property is exported.
            // Which properties should we remove then?
            throw new Error("Implicit remove without an export parameter is not possible.");
        }
    }

    exports = exports || [];
    if (remove === true) {
        remove = exports;
    }

    renderData.multi = multi;
    renderData.removeMulti = Array.isArray(remove);
    renderData.exports = JSON.stringify(exports);
    renderData.remove = JSON.stringify(remove);

    append += appendTemplate(renderData);
    result = prepend + content + append;

    console.log(sourceMap);

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
    return result;
};
