const _ = require('lodash');
const moment = require('moment');

// Function to filter and transform requests
function filterAndTransformRequests(requests) {
    // Add validation to check if requests is array of objects
    if (!Array.isArray(requests) || !requests.every(req => typeof req === 'object' && req !== null)) {
        throw new Error('Invalid input: requests should be an array of objects');
    }

    // Filter the requests based on user-defined criteria
    const filteredRequests = requests.filter(request => {
        // Check if the user is active
        const isActive = request.user && request.user.isActive;

        // Check if the request is created in the last 2 minutes
        const createdWithinLast2Minutes = request.created_datetime && moment().diff(moment(request.created_datetime), 'minutes') <= 2;

        // Check if the assignee email domain is turing.com
        const isAssignedToTuring = request.assignee && request.assignee.email && request.assignee.email.toLowerCase().endsWith('@turing.com');

        return isActive && createdWithinLast2Minutes && isAssignedToTuring;
    });

    // Transform the requests based on transformation rules
    const transformedRequests = filteredRequests.map(request => {
        const transformedRequest = {
            name: request.ticket && request.ticket.name ? request.ticket.name.toUpperCase() : null,
            due_at: request.ticket && request.ticket.priority ? moment().add(request.ticket.priority, 'days').format('YYYY-MM-DD HH:mm:ss') : null,
            created_at: request.created_datetime ? moment(request.created_datetime).format('YYYY-MM-DD HH:mm:ss') : null,
            assignee: request.assignee && request.assignee.email ? request.assignee.email.toLowerCase() : null,
            source: request.ticket && request.ticket.source ? request.ticket.source.toLowerCase() : null,
            processed_at: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        return transformedRequest;
    });

    return transformedRequests;
}

module.exports = { filterAndTransformRequests };