function getWordCloud(hashtags, JsonStructure) {
  if (!/^#[A-Za-z0-9]+(?:#[A-Za-z0-9]+)*$/.test(hashtags)) {
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

  const ids = structure.map(record => record.id);
  if (ids.length !== new Set(ids).size) {
      throw new Error("Multiple Records with same id");
  }

  for (let i = 0; i < structure.length; i++) {
      if (!Number.isInteger(structure[i].id) || structure[i].id !== i + 1) {
          throw new Error("Invalid Json Structure");
      }
      if (!Array.isArray(structure[i].hashtags) || 
          structure[i].hashtags.some(hashtag => typeof hashtag !== 'string')) {
          throw new Error("Invalid Json Structure");
      }
  }

  const transformed = structure.map(record => {
      const uniqueHashtags = [...new Set(record.hashtags)];
      return {
          id: record.id,
          hashtags: uniqueHashtags.sort()
      };
  });

  const repeatedHashtags = [];
  structure.forEach(record => {
      const seen = new Set();
      record.hashtags.forEach(hashtag => {
          if (seen.has(hashtag)) {
              repeatedHashtags.push(hashtag);
          } else {
              seen.add(hashtag);
          }
      });
  });

  if (repeatedHashtags.length > 0) {
      transformed.push({
          id: structure.length + 1,
          hashtags: repeatedHashtags.sort()
      });
  }

  return transformed;
}

module.exports = {
  getWordCloud,
  transformStructure
};