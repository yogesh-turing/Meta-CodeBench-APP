// solution code
class FileCompressor {
  compress(data) {
    if (!data) return "";

    let compressed = "";
    let count = 1;

    for (let i = 1; i < data.length; i++) {
      if (data[i] === data[i - 1]) {
        count++;
      } else {
        compressed += data[i - 1] + count;
        count = 1;
      }
    }

    compressed += data[data.length - 1] + count;

    return compressed;
  }

  decompress(data) {
    if (!data) return "";

    let decompressed = "";
    let regex = /^([a-zA-Z]\d+)+$/;

    if (!regex.test(data)) return "";
    for (let i = 0; i < data.length; i++) {
      let char = data[i];
      let count = "";

      while (++i < data.length && /\d/.test(data[i])) {
        count += data[i];
      }

      decompressed += char.repeat(Number(count));
      i--;
    }

    return decompressed;
  }
}

module.exports = FileCompressor;