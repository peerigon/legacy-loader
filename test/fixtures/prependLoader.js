"use strict";

var loaderUtils = require("loader-utils");
var SourceNode = require("source-map").SourceNode;

/**
 * @name LoaderContext
 * @property {function} callback
 */

/**
 * @this LoaderContext
 * @param {string} content
 * @returns {string}
 */
function prependLoader(content) {
    var currentRequest = loaderUtils.getCurrentRequest(this);
    var node;
    var result;

    node = new SourceNode(1, 1, currentRequest);
    node.setSourceContent(currentRequest, content);
    node.prepend("'something to prepend';");
    node.add("'something to append';");
    result = node.toStringWithSourceMap({
        file: currentRequest
    });
    return this.callback(null, result.code, result.map.toJSON());
}

module.exports = prependLoader;
