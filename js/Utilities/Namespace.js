(function () {
    "use strict";

    window.DEV = window.DEV || {};

    DEV.namespace = function (namespaceString) {
        var parts = namespaceString.split('.'),
            parent = DEV, i;
        if (parts[0] === "DEV") {
            parts = parts.slice(1);
        }
        for (i = 0; i < parts.length; i += 1 ) {
            if (typeof parent[ parts[i]] === "undefined" ) {
                parent[parts[i]] = {};
            }
            parent = parent[parts[i]];
        }
        return parent;
    };

})();