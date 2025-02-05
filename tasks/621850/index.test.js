// const { minCohesiveGroups } = require(process.env.TARGET_FILE);
const { minCohesiveGroups } = require('./correct');

describe('minCohesiveGroups Tests', () => {
    it('should return 1 for ["A", "B", "A", "B", "A"]', () => {
        expect(minCohesiveGroups(["A", "B", "A", "B", "A"])).toBe(1);
    });

    it('should return 0 for an empty array', () => {
        expect(minCohesiveGroups([])).toBe(0);
    });

    it('should return 2 for ["A", "B", "A", "B", "A", "B"]', () => {
        expect(minCohesiveGroups(["A", "B", "A", "B", "A", "B"])).toBe(2);
    });

    it('should return 2 for ["A", "B"]', () => {
        expect(minCohesiveGroups(["A", "B"])).toBe(2);
    });

    it('should return 1 for ["A"]', () => {
        expect(minCohesiveGroups(["A"])).toBe(1);
    });

    it('should return 5 for ["A", "B", "C", "D", "E"]', () => {
        expect(minCohesiveGroups(["A", "B", "C", "D", "E"])).toBe(5);
    });

    it('should return 1 for ["A", "B", "A"]', () => {
        expect(minCohesiveGroups(["A", "B", "A"])).toBe(1);
    });

    it('should return 2 for ["@", "#", "@", "#"]', () => {
        expect(minCohesiveGroups(["@", "#", "@", "#"])).toBe(2);
    });

    it('should return 234 for a long sequence', () => {
        const sequence = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".repeat(9)];
        expect(minCohesiveGroups(sequence)).toBe(234);
    });

    it('should return 1 for ["A", "A", "A"]', () => {
        expect(minCohesiveGroups(["A", "A", "A"])).toBe(1);
    });

    it('should return 1 for a large repetitive sequence of "A"', () => {
        const sequence = Array(300).fill("A");
        expect(minCohesiveGroups(sequence)).toBe(1);
    });
});
