const _ = require('lodash');
const moment = require('moment');

function filterAndTransformRequests(requests) {
    // Input validation
    if (!Array.isArray(requests)) {
        throw new Error('Input must be an array');
    }

    if (!requests.every(item => typeof item === 'object' && item !== null)) {
        throw new Error('All items in the array must be objects');
    }

    // Filter requests
    const twoMinutesAgo = moment().subtract(2, 'minutes');
    
    const filteredRequests = requests.filter(request => {
        // Check if user exists and is active
        const isUserActive = _.get(request, 'user.isActive', false);
        
        // Check creation time
        const createdAt = moment(_.get(request, 'created_datetime'));
        const isRecentlyCreated = createdAt.isValid() && createdAt.isAfter(twoMinutesAgo);
        
        // Check assignee email
        const assigneeEmail = _.get(request, 'assignee.email', '').toLowerCase();
        const isTuringEmail = assigneeEmail.endsWith('turing.com');
        
        return isUserActive && isRecentlyCreated && isTuringEmail;
    });

    // Transform requests
    const transformedRequests = filteredRequests.map(request => {
        const transformationRules = {
            name: {
                path: 'ticket.name',
                transform: value => value ? value.toUpperCase() : null
            },
            due_at: {
                path: 'ticket.priority',
                transform: value => {
                    if (!value || isNaN(value)) return null;
                    return moment().add(parseInt(value), 'days')
                        .format('YYYY-MM-DD HH:mm:ss');
                }
            },
            created_at: {
                path: 'created_datetime',
                transform: value => value ? 
                    moment(value).format('YYYY-MM-DD HH:mm:ss') : null
            },
            assignee: {
                path: 'assignee.email',
                transform: value => value ? value.toLowerCase() : null
            },
            source: {
                path: 'ticket.source',
                transform: value => value ? value.toLowerCase() : null
            },
            processed_at: {
                path: null,
                transform: () => moment().format('YYYY-MM-DD HH:mm:ss')
            }
        };

        const transformed = {};
        
        Object.entries(transformationRules).forEach(([key, rule]) => {
            const value = rule.path ? _.get(request, rule.path) : null;
            transformed[key] = rule.transform(value);
        });

        return transformed;
    });

    return transformedRequests;
}

module.exports = { filterAndTransformRequests };