async function processUsers(users, pageSize, fetchUserMetadata) {
    // Input validation
    if (!Array.isArray(users) || !pageSize || typeof fetchUserMetadata !== 'function') {
        throw new Error('Invalid input parameters');
    }

    // Filter active users and remove duplicates
    const uniqueActiveUsers = getUniqueActiveUsers(users);

    // Create paginated batches
    const paginatedBatches = [...paginateUsers(uniqueActiveUsers, pageSize)];

    // Fetch metadata for all batches
    const resultsWithMetadata = await Promise.all(
        paginatedBatches.map(batch => fetchMetadataForBatch(batch, fetchUserMetadata))
    );

    return resultsWithMetadata;
}

function getUniqueActiveUsers(users) {
    // Use Map to efficiently track unique emails
    const uniqueEmailMap = new Map();

    return users
        .filter(user => user.isActive)
        .filter(user => {
            if (!uniqueEmailMap.has(user.email)) {
                uniqueEmailMap.set(user.email, true);
                return true;
            }
            return false;
        });
}

function* paginateUsers(users, pageSize) {
    for (let i = 0; i < users.length; i += pageSize) {
        yield users.slice(i, i + pageSize);
    }
}

async function fetchMetadataForBatch(batch, fetchUserMetadata) {
    return Promise.all(
        batch.map(async user => ({
            ...user,
            metadata: await fetchUserMetadata(user.id)
        }))
    );
}

module.exports = { processUsers };