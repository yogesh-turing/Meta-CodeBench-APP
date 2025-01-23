async function* processUsers(users, pageSize, fetchUserMetadata) {
  if (!users.length || !pageSize) {
    return;
  }

  // Step 1: Filter active users and remove duplicates based on email
  const activeUniqueUsers = [...new Map(users.filter(user => user.isActive).map(user => [user.email, user])).values()];

  // Step 2: Generate paginated results
  for (let i = 0; i < activeUniqueUsers.length; i += pageSize) {
    const page = activeUniqueUsers.slice(i, i + pageSize);

    // Step 3: Fetch additional metadata for each user in the page
    const pageWithMetadata = await Promise.all(page.map(async user => ({ ...user, metadata: await fetchUserMetadata(user.id) })));

    yield pageWithMetadata;
  }
}

module.exports = {
  processUsers
};