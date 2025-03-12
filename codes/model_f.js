function getWordCloud(hashtags, JsonStructure) {
  // Check if the input string is a valid hashtags string
  if (!/^#([A-Za-z0-9]+)(#[A-Za-z0-9]+)*#$/.test(hashtags)) {
      throw new Error("Not a hashtags string");
  }

  // Transform the structure
  const transformedStructure = transformStructure(JsonStructure);

  // Get the individual hashtags from the input string
  const hashtagList = hashtags.slice(1, -1).split('#');

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

  // Check for multiple records with the same id or non-sequential IDs
  const ids = structure.map((record) => record.id);
  const uniqueIds = new Set(ids);
  const isSequential = ids.every((value, index) => value === index + 1);

  if (ids.length !== uniqueIds.size || !isSequential) {
      throw new Error("Invalid Json Structure");
  }

  structure.forEach((record) => {
      // Check if the id is an integer
      if (!Number.isInteger(record.id)) {
          throw new Error("Invalid Json Structure");
      }

      // Check if the hashtags is an array of strings
      if (!Array.isArray(record.hashtags) || record.hashtags.some((hashtag) => typeof hashtag !== 'string')) {
          throw new Error("Invalid Json Structure");
      }
  });

  // Initialize the transformed structure
  const transformed = [];
  const repeatedHashtags = [];

  structure.forEach((record) => {
      const seenHashtags = {};
      const uniqueHashtags = [];

      record.hashtags.forEach((hashtag) => {
          if (seenHashtags[hashtag]) {
              repeatedHashtags.push(hashtag);
          } else {
              uniqueHashtags.push(hashtag);
              seenHashtags[hashtag] = true;
          }
      });

      transformed.push({
          id: record.id,
          hashtags: uniqueHashtags.sort(),
      });
  });

  // Add a new record for the repeated hashtags
  if (repeatedHashtags.length > 0) {
      transformed.push({
          id: structure.length + 1,
          hashtags: repeatedHashtags.sort(),
      });
  }

  // Ensure the transformed structure is sorted by id
  transformed.sort((a, b) => a.id - b.id);

  return transformed;
}

// Export the functions
module.exports = {
  getWordCloud,
  transformStructure
};