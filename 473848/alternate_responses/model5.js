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
        try {
            // Validate query structure
            if (!query || (!query.filter && !query.aggregate)) {
                throw new Error("Invalid query structure");
            }

            // Filter data
            let filteredData = this.data;
            if (query.filter) {
                const validFields = Object.keys(query.filter).filter(field => 
                    this.data.some(d => field in d)
                );

                if (validFields.length === 0 && Object.keys(query.filter).length > 0) {
                    return { error: "Non-existent fields" };
                }

                filteredData = this.data.filter(dataPoint => {
                    return validFields.every(field => {
                        const condition = query.filter[field];
                        if (typeof condition === 'string') {
                            if (condition.startsWith('>')) {
                                return dataPoint[field] > parseFloat(condition.substring(1));
                            } else if (condition.startsWith('<')) {
                                return dataPoint[field] < parseFloat(condition.substring(1));
                            } else {
                                return dataPoint[field] === condition;
                            }
                        }
                        return dataPoint[field] === condition;
                    });
                });
            }

            // Perform aggregation
            if (!query.aggregate || !Array.isArray(query.aggregate)) {
                return filteredData;
            }

            const result = {};
            const values = filteredData.map(d => d.value);

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

        } catch (error) {
            return { error: error.message };
        }
    }
}

module.exports = { DataAggregator };