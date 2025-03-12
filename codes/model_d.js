function getWordCloud(hashtags, JsonStructure) {
  if (!/^#[A-Za-z0-9]+(#[A-Za-z0-9]+)*$/.test(hashtags)) {
      throw new Error("Not a hashtags string");
  }

  const transformedStructure = transformStructure(JsonStructure);
  const hashtagList = hashtags.split('#').filter(Boolean);
  const result = [];

  hashtagList.forEach((hashtag) => {
      let count = 0;
      transformedStructure.forEach((record) => {
          count += record.hashtags.filter((h) => h === hashtag).length;
      });
      result.push([hashtag, count]);
  });

  return result.sort((a, b) => a[0].localeCompare(b[0]));
}

function transformStructure(structure) {
  if (!Array.isArray(structure) || structure.length === 0) {
      throw new Error("Invalid Json Structure");
  }

  const idSet = new Set(structure.map(record => record.id));
  if (structure.length !== idSet.size) {
      throw new Error("Multiple Records with same id");
  }

  for (let i = 0; i < structure.length; i++) {
      const record = structure[i];
      if (!Number.isInteger(record.id) || record.id !== i + 1) {
          throw new Error("Invalid Json Structure");
      }
      if (!Array.isArray(record.hashtags) || 
          record.hashtags.some(hashtag => typeof hashtag !== 'string')) {
          throw new Error("Invalid Json Structure");
      }
  }

  const transformed = structure.map(record => {
      const hashtagCount = {};
      record.hashtags.forEach(hashtag => {
          hashtagCount[hashtag] = (hashtagCount[hashtag] || 0) + 1;
      });

      const uniqueHashtags = [];
      const repeatedHashtags = [];
      
      Object.entries(hashtagCount).forEach(([hashtag, count]) => {
          if (count === 1) {
              uniqueHashtags.push(hashtag);
          } else {
              for (let i = 0; i < count; i++) {
                  repeatedHashtags.push(hashtag);
              }
          }
      });

      return {
          id: record.id,
          hashtags: uniqueHashtags.sort()
      };
  });

  const allRepeatedHashtags = [];
  structure.forEach(record => {
      const hashtagCount = {};
      record.hashtags.forEach(hashtag => {
          hashtagCount[hashtag] = (hashtagCount[hashtag] || 0) + 1;
      });
      
      Object.entries(hashtagCount).forEach(([hashtag, count]) => {
          if (count > 1) {
              for (let i = 0; i < count; i++) {
                  allRepeatedHashtags.push(hashtag);
              }
          }
      });
  });

  if (allRepeatedHashtags.length > 0) {
      transformed.push({
          id: structure.length + 1,
          hashtags: allRepeatedHashtags.sort()
      });
  }

  return transformed;
}

module.exports = {
  getWordCloud,
  transformStructure
};