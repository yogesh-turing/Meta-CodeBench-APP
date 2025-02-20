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
            if (dataPoint.timestamp > this.data[existingIndex].timestamp) {
                this.data.splice(existingIndex, 1);
            } else {
                return; // Keep existing data point if it's newer
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

        this.data.splice(left, 0, dataPoint);
    }

    getAggregatedData(query) {
        if (!query || !query.filter) {
            return { error: "Invalid query structure" };
        }

        try {
            // Filter data based on query conditions
            let filteredData = this.data.filter(item => {
                return Object.entries(query.filter).every(([field, condition]) => {
                    if (!(field in item)) {
                        return true; // Ignore non-existent fields
                    }

                    if (typeof condition === 'string') {
                        const operator = condition.charAt(0);
                        const value = parseFloat(condition.substring(1));

                        switch (operator) {
                            case '>': return item[field] > value;
                            case '<': return item[field] < value;
                            case '=': return item[field] === value;
                            default: return item[field] === condition;
                        }
                    }
                    return item[field] === condition;
                });
            });

            // Check if any valid fields were used in filtering
            const hasValidFields = Object.keys(query.filter).some(field => 
                this.data.some(item => field in item)
            );

            if (!hasValidFields) {
                return { error: "Non-existent fields" };
            }

            // Perform aggregations
            if (query.aggregate && Array.isArray(query.aggregate)) {
                const result = {};
                const values = filteredData.map(item => item.value);

                query.aggregate.forEach(agg => {
                    switch (agg.toLowerCase()) {
                        case 'sum':
                            result.sum = values.reduce((a, b) => a + b, 0);
                            break;
                        case 'average':
                            result.average = values.length > 0 ? 
                                values.reduce((a, b) => a + b, 0) / values.length : 0;
                            break;
                        case 'min':
                            result.min = Math.min(...values);
                            break;
                        case 'max':
                            result.max = Math.max(...values);
                            break;
                    }
                });

                return result;
            }

            return filteredData;
        } catch (error) {
            return { error: error.message };
        }
    }
}

module.exports = { DataAggregator };