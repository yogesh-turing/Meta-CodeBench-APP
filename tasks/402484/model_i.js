// Helper function to filter active users
function filterActiveUsers(users) {
  return users.filter(user => user.isActive);
}

// Helper function to remove duplicates based on email
function removeDuplicates(users) {
  const seenEmails = new Set();
  return users.filter(user => {
    if (seenEmails.has(user.email)) {
      return false;
    }
    seenEmails.add(user.email);
    return true;
  });
}

// Helper function to fetch metadata for a user
async function fetchMetadata(user, fetchUserMetadata) {
  const metadata = await fetchUserMetadata(user.id);
  return { ...user, metadata };
}

// Generator function to lazily paginate results
function* paginate(users, pageSize) {
  for (let i = 0; i < users.length; i += pageSize) {
    yield users.slice(i, i + pageSize);
  }
}

// Main function to process users
async function* processUsers(users, pageSize, fetchUserMetadata) {
  if (!users.length || !pageSize) {
    return;
  }

  // Step 1: Filter active users
  const activeUsers = filterActiveUsers(users);

  // Step 2: Remove duplicates based on email
  const deduplicatedUsers = removeDuplicates(activeUsers);

  // Step 3: Generate paginated results
  const paginatedResults = paginate(deduplicatedUsers, pageSize);

  // Step 4: Fetch additional metadata
  for (const page of paginatedResults) {
    const pageWithMetadata = await Promise.all(page.map(user => fetchMetadata(user, fetchUserMetadata)));
    yield pageWithMetadata;
  }
}

module.exports = {
  processUsers
};