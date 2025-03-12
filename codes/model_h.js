function transformStructure(structure) {
  // Check if the input structure is valid
  if (!Array.isArray(structure) || structure.length === 0) {
      throw new Error("Invalid JSON Structure");
  }

  // Ensure IDs start at 1 and increment consecutively
  const ids = structure.map(record => record.id);
  for (let i = 0; i < ids.length; i++) {
      if (ids[i] !== i + 1) {
          throw new Error("Invalid JSON Structure");
      }
  }

  // Check for multiple records with the same id
  if (ids.length !== new Set(ids).size) {
      throw new Error("Multiple Records with same id");
  }

  // Validate each record
  structure.forEach((record) => {
      if (!Number.isInteger(record.id) || record.id < 1) {
          throw new Error("Invalid JSON Structure");
      }

      if (!Array.isArray(record.hashtags) || record.hashtags.some((hashtag) => typeof hashtag !== 'string')) {
          throw new Error("Invalid JSON Structure");
      }
  });

  const transformed = [];
  const repeatedHashtags = [];

  structure.forEach((record) => {
      const uniqueHashtags = [];
      const seen = new Set();

      record.hashtags.forEach((hashtag) => {
          if (seen.has(hashtag)) {
              repeatedHashtags.push(hashtag);
          } else {
              uniqueHashtags.push(hashtag);
              seen.add(hashtag);
          }
      });

      transformed.push({
          id: record.id,
          hashtags: uniqueHashtags.sort(),
      });
  });

  if (repeatedHashtags.length > 0) {
      transformed.push({
          id: structure.length + 1,
          hashtags: repeatedHashtags.sort(),
      });
  }

  transformed.sort((a, b) => a.id - b.id);

  return transformed;
}

function getWordCloud(hashtags, JsonStructure) {
  // Validate hashtags string
  if (!/^#+([A-Za-z0-9]+#)*$/.test(hashtags)) {
      throw new Error("Not a hashtags string");
  }

  const transformedStructure = transformStructure(JsonStructure);

  const hashtagList = hashtags.slice(1).split('#').filter(Boolean);

  const result = [];

  hashtagList.forEach((hashtag) => {
      let count = 0;

      transformedStructure.forEach((record) => {
          count += record.hashtags.filter((h) => h === hashtag).length;
      });

      result.push([hashtag, count]);
  });

  result.sort((a, b) => a[0].localeCompare(b[0]));

  return result;
}

// Export the functions
module.exports = {
  getWordCloud,
  transformStructure
};