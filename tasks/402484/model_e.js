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
    if (!Array.isArray(users) || !users.length || !pageSize || typeof pageSize !== 'number') {
        return [];
    }

    try {
        // Filter active users and remove duplicates using Set
        const uniqueUsers = Array.from(
            new Map(
                users
                    .filter(user => user.isActive)
                    .map(user => [user.email, user])
            ).values()
        );

        const result = [];
        // Use generator for pagination
        for await (const page of paginateArray(uniqueUsers, pageSize)) {
            // Fetch metadata concurrently for each page
            const pageWithMetadata = await fetchMetadataForUsers(page, fetchUserMetadata);
            result.push(pageWithMetadata);
        }

        return result;
    } catch (error) {
        console.error('Error processing users:', error);
        throw error;
    }
}

module.exports = {
    processUsers
};