class FileCompressor {
    compress(data) {
        if (!data) return "";
        let compressed = "";
        let count = 1;
        for (let i = 1; i <= data.length; i++) {
            if (i === data.length || data[i] !== data[i - 1]) {
                compressed += data[i - 1] + count;
                count = 1;
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
            let char = data[i++];
            let count = "";
            while (i < data.length && !isNaN(data[i])) {
                count += data[i++];
            }
            if (count === "") return "";
            let num = parseInt(count);
            if (isNaN(num) || num <= 0) return "";
            decompressed += char.repeat(num);
        }
        return decompressed;
    }
}

module.exports = FileCompressor;