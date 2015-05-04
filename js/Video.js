DEV.Video = function () {
    "use strict";

    var init = function () {
        var video = document.getElementById("eagleVideo");
        video.addEventListener("canplay", function () {
            document.getElementById("btnStart").disabled = false;
        }, false);
    };

    return {init: init};
};