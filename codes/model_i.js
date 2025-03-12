function getWordCloud(hashtags, JsonStructure) {
  // Check if the input string is a valid hashtags string
  if (/[^#]/.test(hashtags.replace(/#\w+/g, ''))) {
      throw new Error("Not a hashtags string");
  }

  // Transform the structure
  const transformedStructure = transformStructure(JsonStructure);

  // Get the individual hashtags from the input string
  const hashtagList = hashtags.slice(1).split('#');

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
      throw new Error("Invalid JSON Structure");
  }

  // Check for sequential IDs starting from 1
  for (let i = 0; i < structure.length; i++) {
      if (structure[i].id !== i + 1) {
          throw new Error("Invalid JSON Structure");
      }
  }

  // Check for multiple records with the same id
  if (structure.length !== new Set(structure.map((record) => record.id)).size) {
      throw new Error("Multiple Records with same id");
  }

  // Initialize the transformed structure
  const transformed = [];
  const repeatedHashtags = [];

  // Loop through each record in the structure
  structure.forEach((record) => {
      // Check if the id is an integer
      if (!Number.isInteger(record.id)) {
          throw new Error("Invalid JSON Structure");
      }

      // Check if the hashtags is an array of strings
      if (!Array.isArray(record.hashtags) || record.hashtags.some((hashtag) => typeof hashtag !== 'string')) {
          throw new Error("Invalid JSON Structure");
      }

      // Get the hashtags that appear more than once within the same record
      const seen = new Set();
      const repeatedInRecord = new Set();
      record.hashtags.forEach(hashtag => {
          if (seen.has(hashtag)) {
              repeatedInRecord.add(hashtag);
          } else {
              seen.add(hashtag);
          }
      });

      // Add the record to the transformed structure with the repeated hashtags removed
      transformed.push({
          id: record.id,
          hashtags: record.hashtags.filter((hashtag) => !repeatedInRecord.has(hashtag)),
      });

      // Collect repeated hashtags
      repeatedHashtags.push(...Array.from(repeatedInRecord));
  });

  // Add a new record for the repeated hashtags if there are any
  if (repeatedHashtags.length > 0) {
      transformed.push({
          id: structure.length + 1,
          hashtags: repeatedHashtags.sort(),
      });
  }

  // Sort the transformed structure by id in ascending order
  transformed.sort((a, b) => a.id - b.id);

  // Sort the hashtags in each record in ascending order
  transformed.forEach((record) => {
      record.hashtags.sort();
  });

  return transformed;
}

// Export the functions
module.exports = {
  getWordCloud,
  transformStructure
};