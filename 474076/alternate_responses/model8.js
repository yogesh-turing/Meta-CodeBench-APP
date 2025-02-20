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
        let i = 0;

        while (i < data.length) {
            let char = data[i];
            let count = "";

            i++;

            while (i < data.length && !isNaN(data[i])) {
                count += data[i];
                i++;
            }

            if (count === "") return "";

            let num = parseInt(count);
            if (isNaN(num) || num <= 0) return "";

            for (let j = 0; j < num; j++) {
                decompressed += char;
            }
        }

        return decompressed;
    }
}

module.exports = FileCompressor;