describe("DEV.namespace", function () {
    "use strict";

    describe("constructor function", function () {
        it("should create the DEV namespace", function () {
            expect(DEV).toBeDefined();
        });
    });

    describe("namespace()", function () {
        it("should create a namespace when called", function () {
            DEV.namespace("DEV.testnamespace");

            expect(DEV.testnamespace).toBeDefined();
        });
    });
});