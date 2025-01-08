const { getAvailableDiscounts } = require("./correct");
const moment = require("moment");
const assert = require("assert");

describe("getAvailableDiscounts", () => {
    it("should return correct discounts for a GOLD member", () => {
        const user = { membershipLevel: "GOLD" };
        const discounts = getAvailableDiscounts(user);

        assert.deepStrictEqual(discounts, [
            { name: "New Year Sale", discount: 15, priority: 3, expiration: "2025-01-15" },
            { name: "Loyalty Reward", discount: 20, priority: 2, expiration: "2025-01-10" },
        ]);
    });

    it("should return correct discounts for a PLATINUM member", () => {
        const user = { membershipLevel: "PLATINUM" };
        const discounts = getAvailableDiscounts(user);

        assert.deepStrictEqual(discounts, [
            { name: "New Year Sale", discount: 20, priority: 3, expiration: "2025-01-15" },
            { name: "Loyalty Reward", discount: 25, priority: 2, expiration: "2025-01-10" },
        ]);
    });

    it("should exclude expired offers", () => {
        const user = { membershipLevel: "SILVER" };
        const discounts = getAvailableDiscounts(user);

        assert.deepStrictEqual(discounts, [
            { name: "New Year Sale", discount: 10, priority: 3, expiration: "2025-01-15" },
            { name: "Loyalty Reward", discount: 15, priority: 2, expiration: "2025-01-10" },
        ]);
    });

    it("should return an empty array if all offers are expired", () => {
        const user = { membershipLevel: "SILVER" };

        // Modify mock offers for this test
        const expiredOffers = [
            { name: "Old Sale", discount: 10, priority: 3, expiration: moment().subtract(1, "day").format("YYYY-MM-DD") },
        ];
        const originalOffers = global.offers; // Backup original offers
        global.offers = expiredOffers;

        const discounts = getAvailableDiscounts(user);
        assert.deepStrictEqual(discounts, []);

        // Restore original offers
        global.offers = originalOffers;
    });

    it("should handle invalid user data gracefully", () => {
        const user = {};
        const discounts = getAvailableDiscounts(user);

        assert.deepStrictEqual(discounts, [
            { name: "New Year Sale", discount: 10, priority: 3, expiration: "2025-01-15" },
            { name: "Loyalty Reward", discount: 15, priority: 2, expiration: "2025-01-10" },
        ]);
    });

    it("should return correct discounts for a SILVER member", () => {
        const user = { membershipLevel: "SILVER" };
        const discounts = getAvailableDiscounts(user);

        assert.deepStrictEqual(discounts, [
            { name: "New Year Sale", discount: 10, priority: 3, expiration: "2025-01-15" },
            { name: "Loyalty Reward", discount: 15, priority: 2, expiration: "2025-01-10" },
        ]);
    });

    it("should return an empty array for a BRONZE member", () => {
        const user = { membershipLevel: "BRONZE" };
        const discounts = getAvailableDiscounts(user);

        assert.deepStrictEqual(discounts, []);
    });

    it("should return correct discounts for a DIAMOND member", () => {
        const user = { membershipLevel: "DIAMOND" };
        const discounts = getAvailableDiscounts(user);

        assert.deepStrictEqual(discounts, [
            { name: "New Year Sale", discount: 25, priority: 3, expiration: "2025-01-15" },
            { name: "Loyalty Reward", discount: 30, priority: 2, expiration: "2025-01-10" },
        ]);
    });

    it("should return correct discounts for a new member", () => {
        const user = { membershipLevel: "NEW" };
        const discounts = getAvailableDiscounts(user);

        assert.deepStrictEqual(discounts, [
            { name: "Welcome Offer", discount: 5, priority: 3, expiration: "2025-01-15" },
        ]);
    });

    it("should return correct discounts for a member with no membership level", () => {
        const user = { membershipLevel: "" };
        const discounts = getAvailableDiscounts(user);

        assert.deepStrictEqual(discounts, [
            { name: "New Year Sale", discount: 5, priority: 3, expiration: "2025-01-15" },
        ]);
    });

    it("should return correct discounts for a member with an unknown membership level", () => {
        const user = { membershipLevel: "UNKNOWN" };
        const discounts = getAvailableDiscounts(user);

        assert.deepStrictEqual(discounts, [
            { name: "New Year Sale", discount: 5, priority: 3, expiration: "2025-01-15" },
        ]);
    });
});
