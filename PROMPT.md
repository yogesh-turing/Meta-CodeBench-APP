Base Code:
```javascript
async function processUsers(users, pageSize, fetchUserMetadata) {
  if (!users.length || !pageSize) {
      return [];
  }
  // Step 1: Filter active users
  const activeUsers = [];
  for (let i = 0; i < users.length; i++) {
      if (users[i].isActive) {
          activeUsers.push(users[i]);
      }
  }

  // Step 2: Remove duplicates based on email
  const deduplicatedUsers = [];
  const seenEmails = [];
  for (let i = 0; i < activeUsers.length; i++) {
      if (!seenEmails.includes(activeUsers[i].email)) {
          seenEmails.push(activeUsers[i].email);
          deduplicatedUsers.push(activeUsers[i]);
      }
  }

  // Step 3: Generate paginated results
  const paginatedResults = [];
  for (let i = 0; i < deduplicatedUsers.length; i += pageSize) {
      paginatedResults.push(deduplicatedUsers.slice(i, i + pageSize));
  }

  // Step 4: Fetch additional metadata
  const resultsWithMetadata = [];
  for (let i = 0; i < paginatedResults.length; i++) {
      const page = paginatedResults[i];
      const pageWithMetadata = [];
      for (let j = 0; j < page.length; j++) {
          const user = page[j];
          const metadata = await fetchUserMetadata(user.id);
          pageWithMetadata.push({ ...user, metadata });
      }
      resultsWithMetadata.push(pageWithMetadata);
  }

  return resultsWithMetadata;
}


module.exports = {
  processUsers
};
```

Prompt:

The function `processUsers` is used to:
- Filter users who are active.
- Remove users with duplicate email.
- Generate paginated results with user data.
- Fetch additional metadata for each user from an external API.

The function is inefficient, arrays heavily used, nested loops and redundant opertations.

Please help to refactor the code for clarity, performance, and modern best practices.
Consider the following points for refactoring:
- Use Map and/or Set to get rid of duplicate records and improve efficiency.
- Use a generator function to lazily paginate the results.
- Avoid nested loops 
- Split functionality into modular and reusable parts.
- Make sure the function works efficiently, especially for large datasets. 