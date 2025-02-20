class FileCompressor {
    compress(data) {
        if (!data) return "";
        
        // Validate input contains only letters
        if (!/^[a-zA-Z]+$/.test(data)) return "";
        
        let compressed = "";
        let count = 1;
        
        for (let i = 0; i < data.length; i++) {
            // If current character matches next character, increment count
            if (i < data.length - 1 && data[i] === data[i + 1]) {
                count++;
            } else {
                // Add character and count to compressed string
                compressed += data[i] + count;
                count = 1;
            }
        }
        
        return compressed;
    }

    decompress(data) {
        if (!data) return "";
        
        // Validate RLE format: letter followed by positive number
        if (!/^([a-zA-Z]\d+)+$/.test(data)) return "";
        
        let decompressed = "";
        
        // Process pairs of character and count
        for (let i = 0; i < data.length; i += 2) {
            const char = data[i];
            
            // Find the complete number (might be multiple digits)
            let numStr = "";
            let j = i + 1;
            while (j < data.length && /\d/.test(data[j])) {
                numStr += data[j];
                j++;
            }
            
            // Update i to skip the processed digits
            i = j - 2;
            
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