const Main = require('./solution');

describe("countLayers", () => {
    test("Rug 1", () => {
        const rug1 = [
            "RRRRRRRRRRRRRR",
            "RGGGGGGGGGGGGR",
            "RGBBBBBBBBBBGR",
            "RGBBBBBBBBBBGR",
            "RGBBBBBBBBBBGR",
            "RGBBBBBBBBBBGR",
            "RGBBBBBBBBBBGR",
            "RGGGGGGGGGGGGR",
            "RRRRRRRRRRRRRR"
        ];
        expect(Main.countLayers(rug1)).toBe(5);
    });

    test("Rug 2", () => {
        const rug2 = [
            "GGG",
            "GBG",
            "GGG"
        ];
        expect(Main.countLayers(rug2)).toBe(2);
    });

    test("Rug 3", () => {
        const rug3 = [
            "RRRRRRRRR",
            "RBBBBBBBR",
            "RBBRRRBBR",
            "RBBBBBBBR",
            "RRRRRRRRR"
        ];
        expect(Main.countLayers(rug3)).toBe(3);
    });

    test("Rug 4", () => {
        const rug4 = [
            "RRRRRRRRRRR",
            "RRBBBBBBBRR",
            "RRBGGGGGBRR",
            "RRBGRRRGBRR",
            "RRBGRGRGBRR",
            "RRBGRRRGBRR",
            "RRBGGGGGBRR",
            "RRBBBBBBBRR",
            "RRRRRRRRRRR"
        ];
        expect(Main.countLayers(rug4)).toBe(5);
    });

    test("Empty Rug", () => {
        expect(() => Main.countLayers([])).toThrow("Invalid input");
    });

    test("Non-Uniform Row Lengths", () => {
        const rug = [
            "RRR",
            "RR",
            "RRR"
        ];
        expect(() => Main.countLayers(rug)).toThrow("Invalid input");
    });

    test("Invalid Character", () => {
        const rug = [
            "RRR",
            "RBR",
            "RXR"
        ];
        expect(() => Main.countLayers(rug)).toThrow("Invalid input");
    });

    test("Single Character", () => {
        const rug = ["R"];
        expect(Main.countLayers(rug)).toBe(1);
    });

    test("Single Row", () => {
        const rug = ["RGGRGGRGGR"];
        expect(Main.countLayers(rug)).toBe(1);
    });

    test("Single Column", () => {
        const rug = [
            "R",
            "G",
            "G",
            "R"
        ];
        expect(Main.countLayers(rug)).toBe(1);
    });

    test("All Same Color", () => {
        const rug = [
            "RRR",
            "RRR",
            "RRR"
        ];
        expect(Main.countLayers(rug)).toBe(2);
    });

    test("Even Dimensions Symmetric", () => {
        const rug = [
            "RRRR",
            "RGGR",
            "RGGR",
            "RRRR"
        ];
        expect(Main.countLayers(rug)).toBe(2);
    });

    test("All Blue", () => {
        const rug = [
            "BBBB",
            "BBBB",
            "BBBB",
            "BBBB"
        ];
        expect(Main.countLayers(rug)).toBe(2);
    });

    test("All Green", () => {
        const rug = [
            "GGGGG",
            "GGGGG",
            "GGGGG",
            "GGGGG",
            "GGGGG"
        ];
        expect(Main.countLayers(rug)).toBe(3);
    });
});