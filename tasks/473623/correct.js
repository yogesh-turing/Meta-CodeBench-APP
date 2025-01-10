const _ = require('lodash');
const moment = require('moment');

// Function to filter and transform requests
function filterAndTransformRequests(requests) {
    // Input validation: Check if requests is an array of objects
    if (!Array.isArray(requests) || !requests.every(_.isObject)) {
        throw new Error('requests must be an array of objects');
    }

    // Filter the requests based on user-defined criteria
    const filteredRequests = requests.filter(request => {
        // Filter: Check if the user is an active
        const userIsActive = _.get(request, 'user.isActive', false);
        // Filter: Check if the request is created in the last 2 minutes
        const isCreatedRecently = moment(_.get(request, 'created_datetime')).isAfter(moment().subtract(2, 'minutes'));
        // Filter: Check if the request is assigned to users in turing.com
        const isAssignedToTuring = _.get(request, 'assignee.email', '').toLowerCase().endsWith('@turing.com');

        return userIsActive && isCreatedRecently && isAssignedToTuring;
    });

    // Transformation rules
    const transformationRules = {
        "name": "[[request.ticket.name, uppercase]]",
        "due_at": "[[request.ticket.priority, date_add]]",
        "created_at": "[[request.created_datetime]]",
        "assignee": "[[request.assignee.email, lowercase]]",
        "source": "[[request.ticket.source, lowercase]]",
        "processed_at": "[[now]]",
    };

    // Transform the requests based on transformation rules
    const transformedRequests = filteredRequests.map(request => {
        const transformedRequest = {};

        _.forEach(transformationRules, (rule, key) => {
            let [field, transformation] = rule.replace('[[', '').replace(']]', '').split(', ');
            let value;
            if (field.startsWith('request.')) {
                field = field.split('.').slice(1).join('.');
                value = _.get(request, field);

                switch (transformation) {
                    case 'uppercase':
                        value = value ? value.toUpperCase() : null;
                        break;
                    case 'lowercase':
                        value = value ? value.toLowerCase() : null;
                        break;
                    case 'date_add':
                        value = value ? moment().add(+request.ticket.priority, 'days').format('YYYY-MM-DD HH:mm:ss') : null;
                        break;
                    default:
                        value = value ?? null;
                }
            } else {
                switch (field) {
                    case 'now':
                        value = moment().format('YYYY-MM-DD HH:mm:ss');
                        break;
                    default:
                        value = value ?? null;
                }
            }
            transformedRequest[key] = value;
            if (value && key.endsWith('_at')) {
                transformedRequest[key] = moment(value).format('YYYY-MM-DD HH:mm:ss');
            }
        });
        return transformedRequest;
    });

    return transformedRequests;
}

module.exports = { filterAndTransformRequests };