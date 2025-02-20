class FileCompressor {
    compress(data) {
        // Handle empty input
        if (!data) return "";
        
        // Validate input contains only letters
        if (!/^[a-zA-Z]+$/.test(data)) return "";
        
        // Use regex to find consecutive characters and replace with RLE format
        return data.match(/(.)\1*/g)
            .map(group => `${group[0]}${group.length}`)
            .join('');
    }

    decompress(data) {
        // Handle empty input
        if (!data) return "";
        
        // Validate RLE format: character followed by positive integer
        if (!/^([a-zA-Z]\d+)+$/.test(data)) return "";
        
        let result = "";
        // Match each character-number pair
        const matches = data.match(/([a-zA-Z])(\d+)/g);
        
        if (!matches) return "";
        
        try {
            matches.forEach(match => {
                const char = match[0];
                const count = parseInt(match.slice(1));
                
                // Validate count is positive
                if (count <= 0) throw new Error("Invalid count");
                
                result += char.repeat(count);
            });
            
            return result;
        } catch (error) {
            return "";
        }
    }
}

module.exports = FileCompressor;