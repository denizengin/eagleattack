DEV.Intro = function () {

    "use strict";

    var introToggleHandler;

    var toggleIntro = function (callback) {
        introToggleHandler = introToggleHandler ? introToggleHandler : callback;
        var intro = document.getElementById('intro');

        if (intro.style.display === "table-cell") {
            intro.style.display = "none";
            introToggleHandler(false);
        } else {
            intro.style.display = "table-cell";
        }
    };

    document.getElementById("btnStart").addEventListener("click", toggleIntro);

    return {toggle: toggleIntro };
};