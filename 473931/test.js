const { FraudDetector } = require("./solution");

describe("Fraud Detection System", () => {
    let detector;

    beforeEach(() => {
        detector = new FraudDetector();
    });

    test("should flag transactions that exceed velocity check", () => {
        detector.addTransaction({ id: 1, userId: "user1", amount: 100, timestamp: 1000, country: "US", device: "iPhone" });
        detector.addTransaction({ id: 2, userId: "user1", amount: 105, timestamp: 2000, country: "US", device: "iPhone" });
        detector.addTransaction({ id: 3, userId: "user1", amount: 110, timestamp: 3000, country: "US", device: "iPhone" });
        detector.addTransaction({ id: 4, userId: "user1", amount: 115, timestamp: 4000, country: "US", device: "iPhone" });
        detector.addTransaction({ id: 5, userId: "user1", amount: 120, timestamp: 5000, country: "US", device: "iPhone" });

        expect(detector.flaggedTransactions.has(5)).toBe(true);
    });

    test("should flag transactions that exceed anomalous spending threshold", () => {
        for (let i = 1; i <= 10; i++) {
            detector.addTransaction({ id: i, userId: "user1", amount: 100, timestamp: i * 1000, country: "US", device: "iPhone" });
        }
        detector.addTransaction({ id: 11, userId: "user1", amount: 10000, timestamp: 11000, country: "US", device: "iPhone" });

        expect(detector.flaggedTransactions.has(11)).toBe(true);
    });

    test("should flag transactions when geolocation fraud is detected", () => {
        detector.addTransaction({ id: 1, userId: "user2", amount: 50, timestamp: 1000, country: "US", device: "iPhone" });
        detector.addTransaction({ id: 2, userId: "user2", amount: 60, timestamp: 200000, country: "CA", device: "iPhone" });

        expect(detector.flaggedTransactions.has(2)).toBe(true);
    });

    test("should flag transactions when device fingerprinting fraud is detected", () => {
        detector.addTransaction({ id: 1, userId: "user3", amount: 80, timestamp: 1000, country: "US", device: "iPhone" });
        detector.addTransaction({ id: 2, userId: "user3", amount: 90, timestamp: 500000, country: "US", device: "Android" });

        expect(detector.flaggedTransactions.has(2)).toBe(true);
    });

    test("should blacklist users with 3 or more flagged transactions", () => {
        detector.addTransaction({ id: 1, userId: "user4", amount: 100, timestamp: 1000, country: "US", device: "iPhone" });
        detector.addTransaction({ id: 2, userId: "user4", amount: 10000, timestamp: 2000, country: "US", device: "iPhone" });
        detector.addTransaction({ id: 3, userId: "user4", amount: 50, timestamp: 3000, country: "CA", device: "iPhone" });
        detector.addTransaction({ id: 4, userId: "user4", amount: 60, timestamp: 4000, country: "CA", device: "Android" });

        expect(detector.blacklistedUsers.has("user4")).toBe(true);
    });

    test("should not flag normal transactions", () => {
        detector.addTransaction({ id: 1, userId: "user5", amount: 100, timestamp: 1000, country: "US", device: "iPhone" });
        detector.addTransaction({ id: 2, userId: "user5", amount: 105, timestamp: 200000, country: "US", device: "iPhone" });

        expect(detector.flaggedTransactions.size).toBe(0);
        expect(detector.blacklistedUsers.size).toBe(0);
    });

    test("should not blacklist users with less than 3 flagged transactions", () => {
        detector.addTransaction({ id: 1, userId: "user6", amount: 100, timestamp: 1000, country: "US", device: "iPhone" });
        detector.addTransaction({ id: 2, userId: "user6", amount: 10000, timestamp: 2000, country: "US", device: "iPhone" });
        detector.addTransaction({ id: 3, userId: "user6", amount: 50, timestamp: 3000, country: "CA", device: "iPhone" });

        expect(detector.blacklistedUsers.has("user6")).toBe(false);
    });


    test("should handle multiple users independently", () => {
        detector.addTransaction({ id: 1, userId: "user7", amount: 100, timestamp: 1000, country: "US", device: "iPhone" });
        detector.addTransaction({ id: 2, userId: "user7", amount: 150, timestamp: 2000, country: "US", device: "iPhone" });

        detector.addTransaction({ id: 3, userId: "user8", amount: 100, timestamp: 1000, country: "US", device: "iPhone" });
        detector.addTransaction({ id: 4, userId: "user8", amount: 5000, timestamp: 2000, country: "CA", device: "Android" });

        expect(detector.flaggedTransactions.has(2)).toBe(false);
        expect(detector.flaggedTransactions.has(4)).toBe(true);
    });

    test("should detect rapid small transactions", () => {
        for (let i = 1; i <= 6; i++) {
            detector.addTransaction({
                id: i,
                userId: "user9",
                amount: 10,
                timestamp: 1000 + i * 100,
                country: "US",
                device: "iPhone"
            });
        }

        expect(detector.flaggedTransactions.has(6)).toBe(true);
    });

    test("should detect pattern of alternating countries", () => {
        const countries = ["US", "MX", "US", "MX"];
        countries.forEach((country, i) => {
            detector.addTransaction({
                id: i + 1,
                userId: "user10",
                amount: 100,
                timestamp: 1000 * (i + 1),
                country: country,
                device: "iPhone"
            });
        });

        expect(detector.flaggedTransactions.has(2)).toBe(true);
        expect(detector.flaggedTransactions.has(3)).toBe(true);
    });

    test("should handle transactions with same timestamp", () => {
        detector.addTransaction({ id: 1, userId: "user11", amount: 100, timestamp: 1000, country: "US", device: "iPhone" });
        detector.addTransaction({ id: 2, userId: "user11", amount: 200, timestamp: 1000, country: "US", device: "iPhone" });
        detector.addTransaction({ id: 3, userId: "user11", amount: 300, timestamp: 1000, country: "US", device: "iPhone" });
        detector.addTransaction({ id: 4, userId: "user11", amount: 400, timestamp: 1000, country: "US", device: "iPhone" });
        detector.addTransaction({ id: 5, userId: "user11", amount: 500, timestamp: 1000, country: "US", device: "iPhone" });

        expect(detector.flaggedTransactions.has(5)).toBe(true);
    });
});