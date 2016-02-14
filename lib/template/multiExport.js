%MULTI_EXPORT%
    .forEach(function (property) {
        exports[property] = window[property];
        %REMOVE% && delete window[property];
    });
