"use strict";

var loaderUtils = require("loader-utils");
var SourceNode = require("source-map").SourceNode;
var SourceMapConsumer = require("source-map").SourceMapConsumer;
var os = require("os");

/**
 * @name LoaderContext
 * @property {string} query
 * @property {function} cacheable
 * @property {boolean} sourceMap
 */

/**
 * @name Options
 * @property {string|array} [hide] defaults to []
 * @property {string} context defaults to "typeof window === 'undefined' ? null : window"
 * @property {string} export name of the window property that should be exported
 * @property {boolean} delete whether the property should be deleted from the window after exporting it
 */

/**
 * @name PreparedRender
 * @property {string} prepend
 * @property {string} append
 */

/**
 * @this LoaderContext
 * @param {string} content
 * @param {object} sourceMap
 * @returns {string}
 */
function legacyLoader(content, sourceMap) {
    var options = loaderUtils.parseQuery(this.query);
    var currentRequest;
    var str;
    var node;
    var result;

    sanitizeOptions(options);

    this.cacheable();

    str = prepareRender(options);
    result = [
        str.prepend,
        content,
        str.append
    ].join(os.EOL);

    if (this.sourceMap) {
        currentRequest = loaderUtils.getCurrentRequest(this);
        node = getSourceNode(currentRequest, content, sourceMap);
        node.prepend(str.prepend);
        node.add(str.append);
        result = node.toStringWithSourceMap({
            file: currentRequest
        });
        return this.callback(null, result.code, result.map.toJSON());
    }
    return result;
}

/**
 * @private
 * @param {Options} options
 */
function sanitizeOptions(options) {
    options.hide = options.hide || [];
    options.context = "context" in options ?
        options.context :
        "typeof window === 'undefined' ? null : window";
    if (Array.isArray(options.hide) === false) {
        options.hide = [options.hide];
    }

    if (!options.export && options.delete) {
        throw new Error("Don't know which property to delete from window: The delete option is only available in combination with the export option");
    }
}

/**
 * @private
 * @param {Options} options
 * @returns {PreparedRender}
 */
function prepareRender(options) {
    var exportProp = options.export && JSON.stringify(options.export);

    return {
        prepend: [
            "(function (" + options.hide.join(", ") + ") {"
         ].join(os.EOL),
        append: [
            "}).call(" + options.context + ");",
            (exportProp ? "module.exports = window[" + exportProp + "];" : ""),
            (exportProp && options.delete ? "delete window[" + exportProp + "];" : "")
        ].join(os.EOL)
    };
}

/**
 * Creates an instance of SourceNode based on a previous sourceMap if present
 *
 * @private
 * @param {string} currentRequest
 * @param {string} content
 * @param {object} [sourceMap]
 * @returns {SourceNode}
 */
function getSourceNode(currentRequest, content, sourceMap) {
    var node;

    if (sourceMap) {
        node = SourceNode.fromStringWithSourceMap(content, new SourceMapConsumer(sourceMap));
    } else {
        node = new SourceNode(1, 1, currentRequest);
        node.setSourceContent(currentRequest, content);
    }

    return node;
}

module.exports = legacyLoader;
