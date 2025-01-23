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
  processUsers,
};