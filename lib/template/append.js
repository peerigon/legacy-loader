}).call(windowShim, windowShim);

exports = Object.getOwnPropertyNames(windowShim);

if (exports.length === 1) {
    module.exports = windowShim[exports[0]];
} else {
    exports.forEach(function (key) {
        module.exports[key] = windowShim[key];
    });
}
