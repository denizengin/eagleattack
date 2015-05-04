DEV.TranslationManager = function () {
    "use strict";

    var init = function (callback) {
        if (typeof callback === "undefined") {
            throw new Error("Callback should be specified when initializing the Translation Manager");
        }

        loadTranslations("assets/languages/en.json", callback);
    };

    var loadTranslations = function (path, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    var data = JSON.parse(httpRequest.responseText);
                    applyTranslations(data, callback);
                } else {
                    callback({result: "failure"});
                }
            }
        };
        httpRequest.open('GET', path);
        httpRequest.send();
    };

    var applyTranslations = function (translations, callback) {
        var itemsToTranslate = document.querySelectorAll('[data-translate]');
        for (var i=0; i < itemsToTranslate.length; i++) {
            itemsToTranslate[i].innerHTML = translations[itemsToTranslate[0].attributes["data-translate"].value];
        }

        callback({result: "success"});
    };

    return {init: init};
};