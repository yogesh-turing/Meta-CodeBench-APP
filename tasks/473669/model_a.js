const _ = require('lodash');
const moment = require('moment');

// Function to filter and transform requests
function filterAndTransformRequests(requests) {
    // Filter the requests based on user-defined criteria
    const filteredRequests = requests.filter(request => {
        // Filter requests created in the last 2 minutes
        const twoMinutesAgo = moment().subtract(2, 'minutes');
        const requestCreatedTime = moment(request.created_datetime);
        const isRecent = requestCreatedTime.isAfter(twoMinutesAgo);

        // Filter requests assigned to users in turing.com
        const isTuringUser = _.toLower(request.assignee.email).endsWith('@turing.com');

        // Simple example filter: Check if the user is an active
        const isActiveUser = request.user.isActive;

        return isRecent && isTuringUser && isActiveUser;
    });

    // Transform the requests based on transformation rules
    const transformedRequests = filteredRequests.map(request => {
        // Define transformation rules
        const transformationRules = {
            name: '[[request.ticket.name, uppercase]]',
            due_at: '[[request.ticket.priority, date_add]]',
            created_at: '[[request.created_datetime]]',
            assignee: '[[request.assignee.email, lowercase]]',
            source: '[[request.ticket.source, lowercase]]'
        };

        // Apply transformation rules
        const transformedRequest = {};
        _.forEach(transformationRules, (rule, field) => {
            const [value, transformation] = rule.replace('[[', '').replace(']]', '').split(', ');
            let fieldValue = _.get(request, value);

            // Apply transformation if specified
            if (transformation) {
                switch (transformation) {
                    case 'uppercase':
                        fieldValue = _.toUpper(fieldValue);
                        break;
                    case 'lowercase':
                        fieldValue = _.toLower(fieldValue);
                        break;
                    case 'date_add':
                        fieldValue = moment(fieldValue).add(request.ticket.priority, 'days').format('YYYY-MM-DD HH:mm:ss');
                        break;
                    default:
                        break;
                }
            }

            // Format dates
            if (field.endsWith('_at')) {
                fieldValue = moment(fieldValue).format('YYYY-MM-DD HH:mm:ss');
            }

            // Set null if value is not present
            if (!fieldValue) {
                fieldValue = null;
            }

            transformedRequest[field] = fieldValue;
        });

        // Add a timestamp
        transformedRequest.processedAt = new Date().toISOString();

        return transformedRequest;
    });

    return transformedRequests;
}

module.exports = { filterAndTransformRequests };