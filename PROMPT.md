Base Code:

```javascript
const _ = require('lodash');

// Function to filter and transform requests
function filterAndTransformRequests(requests) {
    // Filter the requests based on user-defined criteria
    const filteredRequests = requests.filter(request => {
        // Simple example filter: Check if the user is an active
        return request.user.isActive;
    });

    // Transform the requests based on transformation rules
    const transformedRequests = filteredRequests.map(request => {
        // Example: Add a timestamp
        request.processedAt = new Date().toISOString();
        return request;
    });

    return transformedRequests;
}

module.exports = { filterAndTransformRequests };
```
Prompt:

Please enhance the function `filterAndTransformRequests`,
1.  Filtering enhancements:
    - Filter the request which is created in the last 2 minutes (request.created_datetime)
    - Filter the request which is assigned to users in turing.com (request.assignee.email), and check the email domain with "turing.com". Please consider requests are coming from different systems so data could be in different cases.
2. Transformation Enhancements:
    - Transformations should be dynamic as per the following rules:
        - The transformed request should have a due_at value. Its calculation depends on the `request.sla` value
        - The mapping for the transformed request is as follows, in following object key is transformed request's field and the value represents the rule on how value should be calculated
            {
                "name": "[[request.ticket.name, uppercase]]", // should assign the value of request.ticket.name and convert it to uppercase
                "due_at: "[[request.ticket.priority, date_add]], // should assign the value of request.ticket.priority and add (request.ticket.priority) days to it
                "created_at": "[[request.created_datetime]]", // should assign the value of request.created_datetime
                "assignee": "[[request.assignee.email, lowercase]], // should assign the value of request.assignee.email
                "source": "[[request.ticket.source, lowercase]]", // should assign the value of request.ticket.name and convert it to uppercase
            }
        - The keys ending with the "_at" are dates so these values should be in "YYYY-MM-DD HH:mm:ss" format (e.g., [2024-12-20 14:30:00])
        - In case the value is not present in the request, it should be set to null in the transformed request.
