async function* generatePaginatedResults(users, pageSize, fetchUserMetadata) {
    if (!users.length || !pageSize) {
      return;
    }
  
    // Step 1: Filter active users
    const activeUsers = users.filter(user => user.isActive);
  
    // Step 2: Remove duplicates based on email
    const uniqueEmails = new Set();
    const deduplicatedUsers = activeUsers.filter(user => {
      if (uniqueEmails.has(user.email)) {
        return false;
      }
      uniqueEmails.add(user.email);
      return true;
    });
  
    // Step 3: Generate paginated results
    for (let i = 0; i < deduplicatedUsers.length; i += pageSize) {
      const page = deduplicatedUsers.slice(i, i + pageSize);
      const pageWithMetadata = await Promise.all(page.map(async user => {
        const metadata = await fetchUserMetadata(user.id);
        return { ...user, metadata };
      }));
      yield pageWithMetadata;
    }
  }
  
  module.exports = {
    generatePaginatedResults
  };