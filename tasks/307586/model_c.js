const ONE_MINUTE = 60 * 1000; // 1 minute in milliseconds

async function bid(auction, amount, user) {
    const now = new Date();
    if (auction.endDate.getTime() < now.getTime()) {
        auction.status = 'closed';
        return auction;
    }
    if (canExtend(auction, now)) {
        auction.endDate = new Date(now.getTime() + (auction.extensions.time * 60 * 1000))
        auction.extensions.extended_count = (auction.extensions.extended_count || 0) + 1;
    }

    if (!auction.bids) {
        auction.bids = [];
    }
    auction.bids.push({
        amount,
        createdAt: now,
        createdBy: user
    })
    return auction;
}

async function canExtend(auction, now) {
    // auction cannot be extended
    if (auction.extensions.count === 0) return false;

    // auction already extended to allowed number of times
    if (auction.extensions.extended_count >= auction.extensions.count) {
        return false;
    }

    const time_left = auction.endDate.getTime() - now.getTime()

    return (time_left <= ONE_MINUTE);
}

module.exports = {
    bid,
    canExtend
};