const ONE_MINUTE = 60 * 1000; // 1 minute in milliseconds

async function bid(auction, amount, user) {
    const now = new Date();
    
    // Check if auction has ended
    if (auction.endDate.getTime() < now.getTime()) {
        auction.status = 'closed';
        return auction;
    }

    // Check if auction can be extended
    if (await canExtend(auction, now)) {
        auction.endDate = new Date(now.getTime() + (auction.extensions.time * 60 * 1000));
        auction.extensions.extended_count = (auction.extensions.extended_count || 0) + 1;
    }

    // Add new bid
    if (!auction.bids) {
        auction.bids = [];
    }
    auction.bids.push({
        amount,
        createdAt: now,
        createdBy: user
    });

    return auction;
}

async function canExtend(auction, now) {
    // Check if extensions are allowed
    if (!auction.extensions || auction.extensions.count === 0) {
        return false;
    }

    // Check if maximum extensions limit reached
    if (auction.extensions.extended_count >= auction.extensions.count) {
        return false;
    }

    // Check if bid is within last minute
    const timeLeft = auction.endDate.getTime() - now.getTime();
    return timeLeft <= ONE_MINUTE;
}

module.exports = {
    bid,
    canExtend
};