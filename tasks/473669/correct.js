const _ = require("lodash");
const moment = require("moment");

// Mock data
const offers = [
  { name: "New Year Sale", discount: 10, priority: 3, expiration: "2025-01-15" },
  { name: "Loyalty Reward", discount: 15, priority: 2, expiration: "2025-01-10" },
  { name: "Flash Sale", discount: 20, priority: 1, expiration: "2024-12-31" },
];

class OfferFactory {
  constructor(user) {
    this.user = user;
  }

  getOffers() {
    const userLevel = this.user.membershipLevel;
    return offers.map((offer) => {
      let calculatedDiscount = offer.discount;
      if (userLevel === "GOLD") {
        calculatedDiscount += 5; // Extra discount for GOLD members
      }
      return { ...offer, discount: calculatedDiscount };
    });
  }
}

function getAvailableDiscounts(user) {
  const factory = new OfferFactory(user);
  const availableOffers = factory.getOffers();

  const isExpired = (expirationDate) => {
    const now = moment();
    return moment(expirationDate).isBefore(now, "day");
  };

  const calculateTotalDiscount = (baseDiscount) => {
    let finalDiscount = baseDiscount;
    if (user.membershipLevel === "PLATINUM") {
      finalDiscount += 10; // Platinum members get an extra 10%
    }
    return finalDiscount;
  };

  const result = availableOffers
    .filter((offer) => !isExpired(offer.expiration))
    .map((offer) => {
      const totalDiscount = calculateTotalDiscount(offer.discount);
      return { ...offer, discount: totalDiscount };
    });

  // Sort by priority in descending order
  return _.orderBy(result, ["priority"], ["desc"]);
}

module.exports = { getAvailableDiscounts };
