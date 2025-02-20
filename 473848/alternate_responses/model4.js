class DataAggregator {
    constructor() {
        this.data = [];
        this.requiredFields = ['id', 'timestamp', 'value'];
    }

    addDataPoint(dataPoint) {
        // Validate required fields
        for (const field of this.requiredFields) {
            if (!(field in dataPoint)) {
                throw new Error(`Field '${field}' is required`);
            }
        }

        // Check for existing data point with same ID
        const existingIndex = this.data.findIndex(d => d.id === dataPoint.id);
        if (existingIndex !== -1) {
            // Replace if new timestamp is newer
            if (dataPoint.timestamp > this.data[existingIndex].timestamp) {
                this.data.splice(existingIndex, 1);
            } else {
                return; // Keep existing data point
            }
        }

        // Binary search for insertion point
        let left = 0;
        let right = this.data.length;

        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (this.data[mid].timestamp < dataPoint.timestamp) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        // Insert at the correct position
        this.data.splice(left, 0, dataPoint);
    }

    getAggregatedData(query) {
        try {
            // Validate query structure
            if (!query || (!query.filter && !query.aggregate)) {
                return { error: "Invalid query structure" };
            }

            // Check if all query fields exist in data
            let validFields = false;
            if (query.filter) {
                for (const field in query.filter) {
                    if (this.data.length > 0 && field in this.data[0]) {
                        validFields = true;
                        break;
                    }
                }
                if (!validFields) {
                    return { error: "Non-existent fields" };
                }
            }

            // Filter data
            let filteredData = this.data;
            if (query.filter) {
                filteredData = this.data.filter(item => {
                    return Object.entries(query.filter).every(([field, condition]) => {
                        if (!(field in item)) return true; // Skip non-existent fields
                        
                        if (typeof condition === 'string') {
                            const operator = condition.charAt(0);
                            const value = parseFloat(condition.substring(1));
                            
                            switch(operator) {
                                case '>': return item[field] > value;
                                case '<': return item[field] < value;
                                case '=': return item[field] === value;
                                default: return item[field] === condition;
                            }
                        }
                        return item[field] === condition;
                    });
                });
            }

            // Perform aggregation
            if (!query.aggregate || filteredData.length === 0) {
                return filteredData;
            }

            const result = {};
            for (const agg of query.aggregate) {
                switch(agg) {
                    case 'sum':
                        result.sum = filteredData.reduce((sum, item) => sum + item.value, 0);
                        break;
                    case 'average':
                        result.average = filteredData.reduce((sum, item) => sum + item.value, 0) / filteredData.length;
                        break;
                    case 'min':
                        result.min = Math.min(...filteredData.map(item => item.value));
                        break;
                    case 'max':
                        result.max = Math.max(...filteredData.map(item => item.value));
                        break;
                }
            }

            return result;

        } catch (error) {
            return { error: error.message };
        }
    }
}

module.exports = { DataAggregator };