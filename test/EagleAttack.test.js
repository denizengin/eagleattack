describe("EagleAttack", function () {
    "use strict";

    var savedGameConstructor,
        savedTranslationConstructor;

    beforeEach(function () {
        savedGameConstructor = window.DEV.Game;
        savedTranslationConstructor = window.DEV.TranslationManager;

        window.DEV.Game = function () {
            this.init = jasmine.createSpy("DEV.Game.init");
        };

        window.DEV.TranslationManager = function () {
            this.init = jasmine.createSpy("DEV.TranslationManager.init").and.callFake(function (callback) {
                callback({result: "success"});
            });
        };
    });

    afterEach(function () {
        window.DEV.Game = savedGameConstructor;
        window.DEV.TranslationManager = savedTranslationConstructor;
    });

    it('should load translations and if successful initialize the game', function () {
        var eagleAttack = new DEV.EagleAttack();
        eagleAttack.init();

        expect(eagleAttack.translationManager.init).toHaveBeenCalled();
        expect(eagleAttack.game.init).toHaveBeenCalled();
    });

});