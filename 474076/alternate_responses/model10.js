class FileCompressor {
    compress(data) {
        if (!data) return "";

        let compressed = "";
        let currentChar = data[0];
        let count = 1;

        for (let i = 1; i <= data.length; i++) {
            if (i === data.length || data[i] !== currentChar) {
                compressed += currentChar + count;
                if (i < data.length) {
                    currentChar = data[i];
                    count = 1;
                }
            } else {
                count++;
            }
        }

        return compressed;
    }

    decompress(data) {
        if (!data) return "";

        let decompressed = "";
        let numBuffer = "";

        for (let i = 0; i < data.length; i++) {
            if (isNaN(data[i])) {
                if (numBuffer === "") return "";
                decompressed += data[i - 1].repeat(parseInt(numBuffer));
                numBuffer = "";
            } else {
                numBuffer += data[i];
            }
        }

        return decompressed;
    }
}

module.exports = FileCompressor;