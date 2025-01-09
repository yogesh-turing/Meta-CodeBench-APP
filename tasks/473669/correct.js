const _ = require('lodash');
const moment = require('moment');

// Function to filter and transform requests
function filterAndTransformRequests(requests) {
    const now = moment();

    // Filter the requests based on user-defined criteria
    const filteredRequests = requests.filter(request => {
        const createdDatetime = moment(request.created_datetime);
        const isRecent = now.diff(createdDatetime, 'minutes') <= 2;
        const isTuringAssignee = request.assignee.email.toLowerCase().endsWith('@turing.com');
        return request.user.isActive && isRecent && isTuringAssignee;
    });

    // Transform the requests based on transformation rules
    const transformedRequests = filteredRequests.map(request => {
        const transformedRequest = {
            name: request.ticket.name ? request.ticket.name.toUpperCase() : null,
            due_at: request.ticket.priority ? moment().add(request.ticket.priority, 'days').format('YYYY-MM-DD HH:mm:ss') : null,
            created_at: request.created_datetime ? moment(request.created_datetime).format('YYYY-MM-DD HH:mm:ss') : null,
            assignee: request.assignee.email ? request.assignee.email.toLowerCase() : null,
            source: request.ticket.source ? request.ticket.source.toLowerCase() : null,
        };

        // Add a timestamp
        transformedRequest.processedAt = new Date().toISOString();

        return transformedRequest;
    });

    return transformedRequests;
}

module.exports = { filterAndTransformRequests };