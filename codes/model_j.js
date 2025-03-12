function getWordCloud(hashtags, JsonStructure) {
  // Check if the input string is a valid hashtags string
  if (/[^#a-zA-Z0-9]/.test(hashtags)) {
      throw new Error("Not a hashtags string");
  }

  // Transform the structure
  const transformedStructure = transformStructure(JsonStructure);

  // Get the individual hashtags from the input string
  const hashtagList = hashtags.slice(1).split('#').filter(Boolean);

  // Initialize the result
  const result = [];

  // Loop through each hashtag
  hashtagList.forEach((hashtag) => {
      // Initialize the count
      let count = 0;

      // Loop through each record in the transformed structure
      transformedStructure.forEach((record) => {
          // Count the occurrences of the hashtag in the record
          count += record.hashtags.filter((h) => h === hashtag).length;
      });

      // Add the result to the list
      result.push([hashtag, count]);
  });

  // Sort the result based on the hashtag string in ascending order
  result.sort((a, b) => a[0].localeCompare(b[0]));

  return result;
}

function transformStructure(structure) {
  // Check if the input structure is valid
  if (!Array.isArray(structure) || structure.length === 0) {
      throw new Error("Invalid Json Structure");
  }

  // Check for multiple records with the same id or incorrect id increment
  if (
      structure.length !== new Set(structure.map((record) => record.id)).size ||
      !structure.every((record, index) => record.id === index + 1)
  ) {
      throw new Error("Invalid Json Structure");
  }

  // Check each record in the structure
  structure.forEach((record) => {
      // Check if the id is an integer and if hashtags is an array of strings
      if (!Number.isInteger(record.id) || !Array.isArray(record.hashtags) || record.hashtags.some((hashtag) => typeof hashtag !== 'string')) {
          throw new Error("Invalid Json Structure");
      }
  });

  // Initialize the transformed structure
  const transformed = [];
  const repeatedHashtags = [];

  // Loop through each record in the structure
  structure.forEach((record) => {
      const uniqueHashtags = [];
      const duplicateHashtags = {};

      // Find duplicates and unique hashtags
      record.hashtags.forEach((hashtag) => {
          if (uniqueHashtags.includes(hashtag)) {
              if (!duplicateHashtags[hashtag]) {
                  duplicateHashtags[hashtag] = 2;
              } else {
                  duplicateHashtags[hashtag]++;
              }
          } else {
              uniqueHashtags.push(hashtag);
          }
      });

      // Add to transformed structure without duplicates
      transformed.push({
          id: record.id,
          hashtags: uniqueHashtags.sort(),
      });

      // Add duplicates to repeatedHashtags array
      Object.entries(duplicateHashtags).forEach(([hashtag, count]) => {
          for (let i = 0; i < count; i++) {
              repeatedHashtags.push(hashtag);
          }
      });
  });

  // Add a new record for the repeated hashtags if any
  if (repeatedHashtags.length > 0) {
      transformed.push({
          id: structure.length + 1,
          hashtags: repeatedHashtags.sort(),
      });
  }

  // Sort the transformed structure by id in ascending order
  transformed.sort((a, b) => a.id - b.id);

  return transformed;
}

// Export the functions
module.exports = {
  getWordCloud,
  transformStructure
};