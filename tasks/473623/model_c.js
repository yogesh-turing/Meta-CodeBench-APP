const _ = require('lodash');
const moment = require('moment');

function filterAndTransformRequests(requests) {
    // Input validation
    if (!Array.isArray(requests)) {
        throw new Error('Input must be an array');
    }

    if (!requests.every(item => typeof item === 'object' && item !== null)) {
        throw new Error('All elements must be objects');
    }

    // Filter requests
    const twoMinutesAgo = moment().subtract(2, 'minutes');
    
    const filteredRequests = requests.filter(request => {
        // Check if user is active
        const isUserActive = _.get(request, 'user.isActive', false);
        
        // Check creation time
        const createdDateTime = moment(_.get(request, 'created_datetime'));
        const isRecentlyCreated = createdDateTime.isValid() && 
                                 createdDateTime.isAfter(twoMinutesAgo);
        
        // Check assignee email
        const assigneeEmail = _.get(request, 'assignee.email', '').toLowerCase();
        const isValidAssignee = assigneeEmail.endsWith('turing.com');

        return isUserActive && isRecentlyCreated && isValidAssignee;
    });

    // Transform requests
    const transformationRules = {
        "name": "[[request.ticket.name, uppercase]]",
        "due_at": "[[request.ticket.priority, date_add]]",
        "created_at": "[[request.created_datetime]]",
        "assignee": "[[request.assignee.email, lowercase]]",
        "source": "[[request.ticket.source, lowercase]]",
        "processed_at": "[[now]]"
    };

    const transformedRequests = filteredRequests.map(request => {
        const transformed = {};

        for (const [key, rule] of Object.entries(transformationRules)) {
            const matches = rule.match(/\[\[(.*?)\]\]/);
            if (!matches) continue;

            const [path, transform] = matches[1].split(',').map(s => s.trim());

            let value = null;
            
            if (path === 'now') {
                value = moment().format('YYYY-MM-DD HH:mm:ss');
            } else {
                const rawValue = _.get(request, path, null);
                
                if (rawValue !== null) {
                    switch (transform) {
                        case 'uppercase':
                            value = String(rawValue).toUpperCase();
                            break;
                        case 'lowercase':
                            value = String(rawValue).toLowerCase();
                            break;
                        case 'date_add':
                            value = moment()
                                .add(parseInt(rawValue) || 0, 'days')
                                .format('YYYY-MM-DD HH:mm:ss');
                            break;
                        default:
                            if (key.endsWith('_at')) {
                                value = moment(rawValue)
                                    .format('YYYY-MM-DD HH:mm:ss');
                            } else {
                                value = rawValue;
                            }
                    }
                }
            }

            transformed[key] = value;
        }

        return transformed;
    });

    return transformedRequests;
}

module.exports = { filterAndTransformRequests };