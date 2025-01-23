async function* paginateArray(array, pageSize) {
    for (let i = 0; i < array.length; i += pageSize) {
        yield array.slice(i, i + pageSize);
    }
}

async function fetchMetadataForUsers(users, fetchUserMetadata) {
    const metadataPromises = users.map(user => 
        fetchUserMetadata(user.id)
            .then(metadata => ({ ...user, metadata }))
    );
    return Promise.all(metadataPromises);
}

async function processUsers(users, pageSize, fetchUserMetadata) {
    // Input validation
    if (!Array.isArray(users) || !users.length || !pageSize || pageSize <= 0) {
        return [];
    }

    try {
        // Filter active users and remove duplicates in a single pass
        const uniqueActiveUsers = Array.from(
            new Map(
                users
                    .filter(user => user.isActive)
                    .map(user => [user.email, user])
            ).values()
        );

        // Create result array to store paginated data with metadata
        const result = [];

        // Use generator to paginate and process data
        for await (const page of paginateArray(uniqueActiveUsers, pageSize)) {
            // Fetch metadata for all users in the current page concurrently
            const pageWithMetadata = await fetchMetadataForUsers(page, fetchUserMetadata);
            result.push(pageWithMetadata);
        }

        return result;
    } catch (error) {
        console.error('Error processing users:', error);
        throw error;
    }
}

module.exports = { processUsers };