DEV.EagleAttack = function () {
    "use strict";

    var self;
    this.game = null;
    this.translationManager = null;

    var init = function () {
        self = this;
        this.game = new DEV.Game();
        this.translationManager = new DEV.TranslationManager();

        this.translationManager.init(translationResultHandler);
    };

    var translationResultHandler = function (response) {
        if (response.result === "success") {
            self.game.init();
        }
    };

    return { init: init};
};


