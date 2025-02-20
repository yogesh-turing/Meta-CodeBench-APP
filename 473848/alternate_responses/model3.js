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
            // Replace if new timestamp is more recent
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
        if (!query || !query.filter) {
            return { error: "Invalid query structure" };
        }

        try {
            // Filter data based on query conditions
            let filteredData = this.data.filter(item => {
                return this._applyFilters(item, query.filter);
            });

            if (filteredData.length === 0) {
                return { error: "No matching data found" };
            }

            // Perform aggregations
            if (query.aggregate && query.aggregate.length > 0) {
                const result = {};
                for (const agg of query.aggregate) {
                    switch (agg.toLowerCase()) {
                        case 'sum':
                            result.sum = filteredData.reduce((acc, curr) => acc + curr.value, 0);
                            break;
                        case 'average':
                            result.average = filteredData.reduce((acc, curr) => acc + curr.value, 0) / filteredData.length;
                            break;
                        case 'min':
                            result.min = Math.min(...filteredData.map(d => d.value));
                            break;
                        case 'max':
                            result.max = Math.max(...filteredData.map(d => d.value));
                            break;
                    }
                }
                return result;
            }

            return { data: filteredData };
        } catch (error) {
            return { error: error.message };
        }
    }

    _applyFilters(item, filters) {
        let validFieldFound = false;
        let allFieldsInvalid = true;

        for (const [field, condition] of Object.entries(filters)) {
            if (field in item) {
                validFieldFound = true;
                allFieldsInvalid = false;

                if (typeof condition === 'string') {
                    const operator = condition.charAt(0);
                    const value = parseFloat(condition.substring(1));

                    switch (operator) {
                        case '>':
                            if (!(item[field] > value)) return false;
                            break;
                        case '<':
                            if (!(item[field] < value)) return false;
                            break;
                        case '=':
                            if (!(item[field] == value)) return false;
                            break;
                        default:
                            if (!(item[field] == condition)) return false;
                    }
                } else if (typeof condition === 'object') {
                    // Handle date range
                    if (condition.start && item[field] < condition.start) return false;
                    if (condition.end && item[field] > condition.end) return false;
                }
            }
        }

        if (allFieldsInvalid) {
            throw new Error("Non-existent fields");
        }

        return validFieldFound;
    }
}

module.exports = { DataAggregator };