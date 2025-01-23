async function processUsers(users, pageSize, fetchUserMetadata) {
  // Input validation
  if (!Array.isArray(users) || !users.length || !pageSize || typeof pageSize !== 'number') {
      return [];
  }

  // Filter active users and remove duplicates
  const processedUsers = getUniqueActiveUsers(users);

  // Generate paginated results with metadata
  const paginatedResults = [];
  for (const page of paginateUsers(processedUsers, pageSize)) {
      const pageWithMetadata = await fetchPageMetadata(page, fetchUserMetadata);
      paginatedResults.push(pageWithMetadata);
  }

  return paginatedResults;
}

function getUniqueActiveUsers(users) {
  // Use Map to efficiently track unique emails
  const uniqueUsersMap = new Map();
  
  users
      .filter(user => user.isActive)
      .forEach(user => {
          if (!uniqueUsersMap.has(user.email)) {
              uniqueUsersMap.set(user.email, user);
          }
      });

  return Array.from(uniqueUsersMap.values());
}

function* paginateUsers(users, pageSize) {
  for (let i = 0; i < users.length; i += pageSize) {
      yield users.slice(i, i + pageSize);
  }
}

async function fetchPageMetadata(users, fetchUserMetadata) {
  try {
      // Fetch metadata concurrently for all users in the page
      const metadataPromises = users.map(async user => {
          const metadata = await fetchUserMetadata(user.id);
          return { ...user, metadata };
      });

      return await Promise.all(metadataPromises);
  } catch (error) {
      console.error('Error fetching user metadata:', error);
      throw error;
  }
}

module.exports = { processUsers };