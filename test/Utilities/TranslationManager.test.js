describe("DEV.TranslationManager", function () {
    "use strict";

    describe("init", function () {
        var translationElement;

        beforeEach(function () {
            jasmine.Ajax.install();

            translationElement = document.createElement("div");
            translationElement.setAttribute("data-translate", "introText");

            document.body.appendChild(translationElement);

        });

        afterEach(function () {
            jasmine.Ajax.uninstall();

            document.body.removeChild(translationElement);
        });

        it("should throw if a callback function is not passed", function () {
            var manager = new DEV.TranslationManager();
            expect(function () { manager.init(); }).toThrow(new Error("Callback should be specified when initializing the Translation Manager"));
        });

        it("should try to load the translations and on success apply them and call the passed callback function with result set to success", function () {
            var manager = new DEV.TranslationManager();
            var callback = jasmine.createSpy();
            var translationElement = document.querySelectorAll('[data-translate]')[0];

            jasmine.Ajax.stubRequest("assets/languages/en.json").andReturn({
                "status": 200,

                "contentType": "application/json",

                "responseText": "{\"introText\": \"testText\"}"
            });

            manager.init(callback);

            expect(translationElement.innerHTML).toEqual("testText");
            expect(callback).toHaveBeenCalledWith({result: "success"});
        });

        it("should try to load the translations and onfailure call the passed callback function with result set to failure", function () {
            var manager = new DEV.TranslationManager();
            var callback = jasmine.createSpy();
            jasmine.Ajax.stubRequest("assets/languages/en.json").andReturn({
                "status": 404
            });

            manager.init(callback);

            expect(callback).toHaveBeenCalledWith({result: "failure"});
        });
    });
});