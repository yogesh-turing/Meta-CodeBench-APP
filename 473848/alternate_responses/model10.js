class DataAggregator {
    constructor() {
        this.data = [];
    }

    addDataPoint(dataPoint) {
        // Check if the dataPoint has the required fields (id, timestamp, value)
        if (!dataPoint.id || !dataPoint.timestamp || !dataPoint.value) {
            throw new Error("Missing required field");
        }

        // Check if a data point with the same id already exists
        const existingIndex = this.data.findIndex((point) => point.id === dataPoint.id);

        // If a data point with the same id exists, update it if the new data point has a newer timestamp
        if (existingIndex !== -1) {
            if (dataPoint.timestamp > this.data[existingIndex].timestamp) {
                this.data[existingIndex] = dataPoint;
            }
        } else {
            // If no data point with the same id exists, add the new data point to the array
            this.data.push(dataPoint);
        }

        // Sort the data array by timestamp for optimized query performance
        this.data.sort((a, b) => a.timestamp - b.timestamp);
    }

    getAggregatedData(query) {
        // Check if the query contains any filters or aggregate functions
        if (!query.filter && !query.aggregate) {
            throw new Error("Invalid query");
        }

        // Filter the data based on the query filters
        let filteredData = this.data;
        if (query.filter) {
            filteredData = filteredData.filter((point) => {
                for (const key in query.filter) {
                    if (!point[key] || !eval(`${point[key]} ${query.filter[key]}`)) {
                        return false;
                    }
                }
                return true;
            });
        }

        // Check if any data points are left after filtering
        if (filteredData.length === 0) {
            throw new Error("No data points match the query filters");
        }

        // Aggregate the filtered data based on the query aggregate functions
        const aggregatedData = {};
        if (query.aggregate) {
            for (const func of query.aggregate) {
                switch (func) {
                    case "sum":
                        aggregatedData.sum = filteredData.reduce((acc, point) => acc + point.value, 0);
                        break;
                    case "average":
                        aggregatedData.average = filteredData.reduce((acc, point) => acc + point.value, 0) / filteredData.length;
                        break;
                    case "min":
                        aggregatedData.min = Math.min(...filteredData.map((point) => point.value));
                        break;
                    case "max":
                        aggregatedData.max = Math.max(...filteredData.map((point) => point.value));
                        break;
                    default:
                        throw new Error(`Invalid aggregate function: ${func}`);
                }
            }
        }

        return aggregatedData;
    }
}

module.exports = {DataAggregator};