function* paginateUsers(users, pageSize) {
  for (let i = 0; i < users.length; i += pageSize) {
    yield users.slice(i, i + pageSize);
  }
}

async function fetchUserMetadataBatch(users, fetchUserMetadata) {
  const batch = await Promise.all(users.map(user => fetchUserMetadata(user.id)));
  return users.map((user, index) => ({ ...user, metadata: batch[index] }));
}

async function processUsers(users, pageSize, fetchUserMetadata) {
  if (!users.length || !pageSize) {
    return [];
  }

  // Step 1: Filter active users and remove duplicates based on email
  const activeUsers = new Map();
  users.forEach(user => {
    if (user.isActive) {
      activeUsers.set(user.email, user);
    }
  });

  // Step 2: Convert the Map to an array and generate paginated results
  const paginatedResults = paginateUsers([...activeUsers.values()], pageSize);

  // Step 3: Fetch additional metadata for each page
  const resultsWithMetadata = [];
  for (const page of paginatedResults) {
    resultsWithMetadata.push(await fetchUserMetadataBatch(page, fetchUserMetadata));
  }

  return resultsWithMetadata;
}

module.exports = {
  processUsers
};