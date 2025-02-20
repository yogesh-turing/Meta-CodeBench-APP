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
                // Add current character and count to result
                compressed += data[i] + count;
                count = 1;
            }
        }
        
        return compressed;
    }

    decompress(data) {
        if (!data) return "";
        
        // Validate input format: must be character followed by positive number
        const validFormat = /^([a-zA-Z]\d+)+$/;
        if (!validFormat.test(data)) return "";
        
        let decompressed = "";
        
        // Process pairs of character and count
        for (let i = 0; i < data.length; i += 2) {
            const char = data[i];
            
            // Get the number that follows the character
            let numStr = "";
            let j = i + 1;
            while (j < data.length && /\d/.test(data[j])) {
                numStr += data[j];
                j++;
            }
            
            // Update i to skip the processed digits
            i = j - 1;
            
            const count = parseInt(numStr);
            
            // Validate count is positive
            if (count <= 0) return "";
            
            // Repeat character count times
            decompressed += char.repeat(count);
        }
        
        return decompressed;
    }
}

module.exports = FileCompressor;