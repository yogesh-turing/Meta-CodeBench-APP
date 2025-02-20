class FileCompressor {
    compress(data) {
        if (!data) return "";
        
        let compressed = "";
        let count = 1;
        
        for (let i = 0; i < data.length; i++) {
            // If current character matches next character, increment count
            if (i < data.length - 1 && data[i] === data[i + 1]) {
                count++;
            } else {
                // Append current character and its count
                compressed += data[i] + count;
                count = 1;
            }
        }
        
        return compressed;
    }

    decompress(data) {
        if (!data) return "";
        
        // Validate input format using regex
        // Format should be letter followed by number, repeating
        const validFormat = /^([a-zA-Z]\d+)+$/;
        if (!validFormat.test(data)) return "";
        
        let decompressed = "";
        
        // Process pairs of characters and their counts
        for (let i = 0; i < data.length; i += 2) {
            const char = data[i];
            let countStr = "";
            
            // Get the complete number (might be multiple digits)
            while (i + 1 < data.length && /\d/.test(data[i + 1])) {
                countStr += data[i + 1];
                i++;
            }
            
            const count = parseInt(countStr);
            
            // Validate count is positive
            if (count <= 0) return "";
            
            // Repeat character count times
            decompressed += char.repeat(count);
        }
        
        return decompressed;
    }
}

module.exports = FileCompressor;