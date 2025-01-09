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
        // Check active status
        const isActiveUser = _.get(request, 'user.isActive', false);
        
        // Check creation time
        const createdDateTime = moment(_.get(request, 'created_datetime'));
        const isRecentRequest = createdDateTime.isValid() && createdDateTime.isAfter(twoMinutesAgo);
        
        // Check assignee email
        const assigneeEmail = _.get(request, 'assignee.email', '').toLowerCase();
        const hasTuringEmail = assigneeEmail.endsWith('turing.com');
        
        return isActiveUser && isRecentRequest && hasTuringEmail;
    });

    // Transform requests
    const transformationRules = {
        name: "[[request.ticket.name, uppercase]]",
        due_at: "[[request.ticket.priority, date_add]]",
        created_at: "[[request.created_datetime]]",
        assignee: "[[request.assignee.email, lowercase]]",
        source: "[[request.ticket.source, lowercase]]",
        processed_at: "[[now]]"
    };

    const transformValue = (request, rule) => {
        if (!rule.startsWith('[[') || !rule.endsWith(']]')) {
            return null;
        }

        const [path, transformation] = rule.slice(2, -2).split(',').map(s => s.trim());
        
        if (path === 'now') {
            return moment().format('YYYY-MM-DD HH:mm:ss');
        }

        let value = _.get(request, path);
        
        if (value === undefined) {
            return null;
        }

        switch (transformation) {
            case 'uppercase':
                return String(value).toUpperCase();
            case 'lowercase':
                return String(value).toLowerCase();
            case 'date_add':
                return moment().add(parseInt(value) || 0, 'days').format('YYYY-MM-DD HH:mm:ss');
            case undefined:
                return path.endsWith('_datetime') || path.includes('_at') 
                    ? moment(value).format('YYYY-MM-DD HH:mm:ss')
                    : value;
            default:
                return value;
        }
    };

    const transformedRequests = filteredRequests.map(request => {
        const transformedRequest = {};
        
        Object.entries(transformationRules).forEach(([key, rule]) => {
            transformedRequest[key] = transformValue(request, rule);
        });

        return transformedRequest;
    });

    return transformedRequests;
}

module.exports = { filterAndTransformRequests };