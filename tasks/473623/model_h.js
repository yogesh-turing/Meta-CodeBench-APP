const _ = require('lodash');
const moment = require('moment');

function filterAndTransformRequests(requests) {
    // Check if requests is an array of objects
    if (!Array.isArray(requests) || !requests.every(_.isObject)) {
        throw new Error('Requests must be an array of objects');
    }

    // Filter the requests based on user-defined criteria
    const filteredRequests = requests.filter(request => {
        // Filter the request which has request.user.isActive = true
        if (request.user && !request.user.isActive) return false;

        // Filter the request which is created in the last 2 minutes (request.created_datetime)
        if (request.created_datetime && moment(request.created_datetime).diff(moment(), 'minutes') > 2) return false;

        // Filter the request which is assigned to users in turing.com (request.assignee.email)
        if (request.assignee && !request.assignee.email.toLowerCase().endsWith('turing.com')) return false;

        return true;
    });

    // Define transformation rules
    const transformationRules = {
        name: '[[request.ticket.name, uppercase]]',
        due_at: '[[request.ticket.priority, date_add]]',
        created_at: '[[request.created_datetime]]',
        assignee: '[[request.assignee.email, lowercase]]',
        source: '[[request.ticket.source, lowercase]]',
        processed_at: '[[now]]',
    };

    // Transform the requests based on transformation rules
    const transformedRequests = filteredRequests.map(request => {
        const transformedRequest = {};

        Object.keys(transformationRules).forEach(key => {
            const rule = transformationRules[key];
            const value = applyTransformationRule(request, rule);

            if (key.endsWith('_at')) {
                // Format date-times to "YYYY-MM-DD HH:mm:ss" format
                transformedRequest[key] = moment(value).format('YYYY-MM-DD HH:mm:ss');
            } else {
                transformedRequest[key] = value;
            }
        });

        return transformedRequest;
    });

    return transformedRequests;
}

// Helper function to apply transformation rules
function applyTransformationRule(request, rule) {
    const [field, transformation] = rule.replace('[[', '').replace(']]', '').split(', ');

    let value = _.get(request, field);

    if (transformation === 'uppercase') {
        value = value.toUpperCase();
    } else if (transformation === 'lowercase') {
        value = value.toLowerCase();
    } else if (transformation === 'date_add') {
        value = moment(value).add(request.ticket.priority, 'days').toISOString();
    } else if (transformation === 'now') {
        value = new Date().toISOString();
    }

    return value || null;
}

module.exports = { filterAndTransformRequests };