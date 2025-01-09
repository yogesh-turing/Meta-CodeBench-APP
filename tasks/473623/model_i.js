const _ = require('lodash');
const moment = require('moment');

function filterAndTransformRequests(requests) {
    // Input validations
    if (!Array.isArray(requests)) {
        throw new Error('Requests must be an array of objects');
    }
    if (!requests.every(request => _.isObject(request))) {
        throw new Error('All items in the requests array must be objects');
    }

    // Filtering enhancements
    const filteredRequests = requests.filter(request => {
        // Filter the request which has request.user.isActive = true
        if (request.user && request.user.isActive) {
            // Filter the request which is created in the last 2 minutes
            if (request.created_datetime && moment().diff(moment(request.created_datetime), 'minutes') <= 2) {
                // Filter the request which is assigned to users in turing.com
                if (request.assignee && request.assignee.email && request.assignee.email.toLowerCase().endsWith('turing.com')) {
                    return true;
                }
            }
        }
        return false;
    });

    // Transformation Enhancements
    const transformedRequests = filteredRequests.map(request => {
        const transformedRequest = {};

        // Dynamic transformation rules
        const transformationRules = {
            name: '[[request.ticket.name, uppercase]]',
            due_at: '[[request.ticket.priority, date_add]]',
            created_at: '[[request.created_datetime]]',
            assignee: '[[request.assignee.email, lowercase]]',
            source: '[[request.ticket.source, lowercase]]',
            processed_at: '[[now]]',
        };

        Object.keys(transformationRules).forEach(key => {
            const rule = transformationRules[key];
            const match = rule.match(/\[\[(.*?),\s*(.*?)\]\]/);

            if (match) {
                const path = match[1];
                const method = match[2];

                let value = _.get(request, path);

                if (method === 'uppercase') {
                    value = value ? value.toUpperCase() : null;
                } else if (method === 'lowercase') {
                    value = value ? value.toLowerCase() : null;
                } else if (method === 'date_add') {
                    value = value ? moment(request.created_datetime).add(value, 'days').toISOString() : null;
                } else if (method === 'now') {
                    value = moment().toISOString();
                }

                if (key.endsWith('_at')) {
                    value = value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null;
                }

                transformedRequest[key] = value;
            }
        });

        return transformedRequest;
    });

    return transformedRequests;
}

module.exports = { filterAndTransformRequests };