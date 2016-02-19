"use strict";

var loaderUtils = require("loader-utils");
var SourceNode = require("source-map").SourceNode;
var SourceMapConsumer = require("source-map").SourceMapConsumer;
var os = require("os");

module.exports = function (content, sourceMap) {
    var options = loaderUtils.parseQuery(this.query);
    var currentRequest;
    var str;
    var node;
    var result;

    options.hide = options.hide || [];
    options.context = "context" in options ? options.context : "window";
    if (Array.isArray(options.hide) === false) {
        options.hide = [options.hide];
    }

    this.cacheable();

    if (!options.export && options.delete) {
        throw new Error("Don't know which property to delete from window: The delete option is only available in combination with the export option");
    }

    str = prepareRender(options);

    result = [
        str.prepend,
        content,
        str.append
    ].join(os.EOL);

    if (sourceMap) {
        currentRequest = loaderUtils.getCurrentRequest(this);
        node = SourceNode.fromStringWithSourceMap(content, new SourceMapConsumer(sourceMap));
        node.prepend(str.prepend);
        node.add(str.append);
        result = node.toStringWithSourceMap({
            file: currentRequest
        });
        this.callback(null, result.code, result.map.toJSON());
        return;
    }
    return result;
};

function prepareRender(options) {
    var exportProp = options.export && JSON.stringify(options.export);

    return {
        prepend: [
            "(function (" + options.hide.join(", ") + ") {"
         ].join(os.EOL),
        append: [
            "}).call(" + options.context + ");",
            (exportProp ? "module.exports = window[" + exportProp + "];" : ""),
            (exportProp && options.delete ? "delete window[" + exportProp + "];": "")
        ].join(os.EOL)
    };
}
