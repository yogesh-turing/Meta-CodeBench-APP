const _ = require('lodash');

function filterAndTransformRequests(requests) {
    // Input validation: Check if requests is an array of objects
    if (!Array.isArray(requests) || requests.some(request => typeof request !== 'object')) {
        throw new Error('Requests must be an array of objects');
    }

    // Filter the requests based on user-defined criteria
    const filteredRequests = requests.filter(request => {
        // Filter 1: Check if the user is active
        const userIsActive = request.user && request.user.isActive;

        // Filter 2: Check if the request is created in the last 2 minutes
        const createdAt = request.created_datetime;
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
        const isRecent = createdAt && createdAt >= twoMinutesAgo;

        // Filter 3: Check if the assignee is from turing.com
        const assigneeEmail = request.assignee && request.assignee.email;
        const isTuringAssignee = assigneeEmail && assigneeEmail.toLowerCase().endsWith('turing.com');

        return userIsActive && isRecent && isTuringAssignee;
    });

    // Transform the requests based on transformation rules
    const transformedRequests = filteredRequests.map(request => {
        const transformationRules = {
            name: '[[request.ticket.name, uppercase]]',
            due_at: '[[request.ticket.priority, date_add]]',
            created_at: '[[request.created_datetime]]',
            assignee: '[[request.assignee.email, lowercase]]',
            source: '[[request.ticket.source, lowercase]]',
            processed_at: '[[now]]',
        };

        const transformedRequest = {};

        Object.keys(transformationRules).forEach(key => {
            const rule = transformationRules[key];
            const match = rule.match(/\[\[(.*?)\]\]/);
            if (match) {
                const propertyPath = match[1].split('.');
                const value = _.get(request, propertyPath);
                if (value) {
                    switch (key) {
                        case 'due_at':
                            const priority = request.ticket.priority;
                            const dueDate = new Date(value);
                            dueDate.setDate(dueDate.getDate() + priority);
                            transformedRequest[key] = dueDate.toISOString();
                            break;
                        case 'processed_at':
                            transformedRequest[key] = new Date().toISOString();
                            break;
                        default:
                            transformedRequest[key] = value;
                            if (rule.includes('uppercase')) {
                                transformedRequest[key] = transformedRequest[key].toUpperCase();
                            } else if (rule.includes('lowercase')) {
                                transformedRequest[key] = transformedRequest[key].toLowerCase();
                            }
                            break;
                    }
                } else {
                    transformedRequest[key] = null;
                }
            }
        });

        return transformedRequest;
    });

    return transformedRequests;
}

module.exports = { filterAndTransformRequests };