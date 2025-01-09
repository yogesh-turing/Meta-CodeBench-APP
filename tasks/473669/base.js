const _ = require('lodash');

// Function to filter and transform requests
function filterAndTransformRequests(requests) {
    // Filter the requests based on user-defined criteria
    const filteredRequests = requests.filter(request => {
        // Simple example filter: Check if the user is an active
        return request.user.isActive;
    });

    // Transform the requests based on transformation rules
    const transformedRequests = filteredRequests.map(request => {
        // Example: Add a timestamp
        request.processedAt = new Date().toISOString();
        return request;
    });

    return transformedRequests;
}

module.exports = { filterAndTransformRequests };