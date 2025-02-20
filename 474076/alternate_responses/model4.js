class FileCompressor {
    compress(data) {
        if (!data) return "";
        
        // Validate input contains only letters
        if (!/^[a-zA-Z]+$/.test(data)) return "";
        
        // Replace consecutive characters with RLE format
        return data.replace(/(.)\1*/g, (match, char) => 
            `${char}${match.length}`
        );
    }

    decompress(data) {
        if (!data) return "";
        
        // Validate RLE format: letter followed by positive number
        if (!/^([a-zA-Z]\d+)+$/.test(data)) return "";
        
        let result = "";
        // Match each character-number pair
        const matches = data.match(/([a-zA-Z])(\d+)/g);
        
        if (!matches) return "";
        
        for (const match of matches) {
            const char = match[0];
            const count = parseInt(match.slice(1));
            
            // Validate count is positive
            if (count <= 0) return "";
            
            result += char.repeat(count);
        }
        
        return result;
    }
}

module.exports = FileCompressor;