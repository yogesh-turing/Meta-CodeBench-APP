async function* generatePaginatedResults(users, pageSize, fetchUserMetadata) {
  const activeUsers = users.filter(user => user.isActive);
  const uniqueUsers = [...new Map(activeUsers.map(user => [user.email, user])).values()];

  for (let i = 0; i < uniqueUsers.length; i += pageSize) {
    const page = uniqueUsers.slice(i, i + pageSize);
    const pageWithMetadata = await Promise.all(page.map(async user => ({ ...user, metadata: await fetchUserMetadata(user.id) })));
    yield pageWithMetadata;
  }
}

async function processUsers(users, pageSize, fetchUserMetadata) {
  if (pageSize <= 0) return [];
  const results = [];
  for await (const page of generatePaginatedResults(users, pageSize, fetchUserMetadata)) {
    results.push(page);
  }
  return results;
}

module.exports = {
  processUsers
};