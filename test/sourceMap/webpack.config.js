'use strict';

var path = require('path');

module.exports = {
    entry: path.resolve(__dirname, './entry.js'),
    output: {
        path: path.resolve(__dirname, '../output'),
        filename: 'bundle.sourcemap.js'
    },
    devtool: 'source-map'
};
