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
    const filteredRequests = requests.filter(request => {
        // Check if user is active
        const isUserActive = _.get(request, 'user.isActive', false);
        if (!isUserActive) return false;

        // Check if request was created in last 2 minutes
        const createdDateTime = _.get(request, 'created_datetime');
        if (!createdDateTime) return false;
        
        const isRecentRequest = moment().diff(moment(createdDateTime), 'minutes') <= 2;
        if (!isRecentRequest) return false;

        // Check if assignee email domain is turing.com
        const assigneeEmail = _.get(request, 'assignee.email', '');
        if (!assigneeEmail) return false;
        
        const emailDomain = assigneeEmail.split('@')[1]?.toLowerCase();
        return emailDomain === 'turing.com';
    });

    // Transform requests
    const transformedRequests = filteredRequests.map(request => {
        const transformationRules = {
            name: {
                path: 'ticket.name',
                transform: (value) => value?.toUpperCase() || null
            },
            due_at: {
                path: 'ticket.priority',
                transform: (value) => {
                    if (!value) return null;
                    return moment().add(value, 'days').format('YYYY-MM-DD HH:mm:ss');
                }
            },
            created_at: {
                path: 'created_datetime',
                transform: (value) => value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null
            },
            assignee: {
                path: 'assignee.email',
                transform: (value) => value?.toLowerCase() || null
            },
            source: {
                path: 'ticket.source',
                transform: (value) => value?.toLowerCase() || null
            },
            processed_at: {
                path: null,
                transform: () => moment().format('YYYY-MM-DD HH:mm:ss')
            }
        };

        const transformed = {};
        for (const [key, rule] of Object.entries(transformationRules)) {
            const value = rule.path ? _.get(request, rule.path) : null;
            transformed[key] = rule.transform(value);
        }

        return transformed;
    });

    return transformedRequests;
}

module.exports = { filterAndTransformRequests };