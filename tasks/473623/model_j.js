const _ = require('lodash');
const moment = require('moment');

// Function to filter and transform requests
function filterAndTransformRequests(requests) {
    // Input validation
    if (!_.isArray(requests)) {
        throw new Error('requests must be an array');
    }

    // Check if all items in the array are objects
    if (!requests.every(_.isObject)) {
        throw new Error('requests must be an array of objects');
    }

    // Filter the requests based on user-defined criteria
    const filteredRequests = requests.filter(request => {
        // Check if the user is an active
        if (!request.user || !request.user.isActive) return false;

        // Check if the request was created in the last 2 minutes
        if (!request.created_datetime || moment().diff(moment(request.created_datetime), 'minutes') > 2) return false;

        // Check if the assignee is from turing.com
        if (!request.assignee || !request.assignee.email || !request.assignee.email.toLowerCase().endsWith('turing.com')) return false;

        return true;
    });

    // Transformation rules
    const transformationRules = {
        "name": "[[request.ticket.name, uppercase]]",
        "due_at": "[[request.ticket.priority, date_add]]",
        "created_at": "[[request.created_datetime]]",
        "assignee": "[[request.assignee.email, lowercase]]",
        "source": "[[request.ticket.source, lowercase]]",
        "processed_at": "[[now]]"
    };

    // Transform the requests based on transformation rules
    const transformedRequests = filteredRequests.map(request => {
        const transformedRequest = {};

        _.each(transformationRules, (rule, key) => {
            const value = _.get(request, rule.replace(/\[\[|\]\]|request./g, '').split(',')[0]);

            if (value) {
                switch (rule.split(',')[1]) {
                    case 'uppercase':
                        transformedRequest[key] = value.toUpperCase();
                        break;
                    case 'lowercase':
                        transformedRequest[key] = value.toLowerCase();
                        break;
                    case 'date_add':
                        transformedRequest[key] = moment(value).add(request.ticket.priority, 'days').format('YYYY-MM-DD HH:mm:ss');
                        break;
                    default:
                        transformedRequest[key] = value;
                }
            } else {
                transformedRequest[key] = null;
            }
        });

        return transformedRequest;
    });

    return transformedRequests;
}

module.exports = { filterAndTransformRequests };