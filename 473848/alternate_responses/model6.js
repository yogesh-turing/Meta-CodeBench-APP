class DataAggregator {
    constructor() {
        this.data = [];
    }

    addDataPoint(dataPoint) {
        if (!dataPoint.id || !dataPoint.timestamp || !dataPoint.value) {
            throw new Error("Fields 'id', 'timestamp', and 'value' are required");
        }

        const existingIndex = this.data.findIndex((point) => point.id === dataPoint.id);
        if (existingIndex !== -1) {
            if (this.data[existingIndex].timestamp < dataPoint.timestamp) {
                this.data[existingIndex] = dataPoint;
            }
        } else {
            this.data.push(dataPoint);
            this.data.sort((a, b) => a.timestamp - b.timestamp);
        }
    }

    getAggregatedData(query) {
        if (!query.filter || !query.aggregate) {
            throw new Error("Fields 'filter' and 'aggregate' are required in the query");
        }

        let filteredData = this.data;

        if (query.filter) {
            Object.keys(query.filter).forEach((key) => {
                const value = query.filter[key];
                const operator = value[0];
                const filterValue = value.slice(1);

                if (operator === ">") {
                    filteredData = filteredData.filter((point) => point[key] > filterValue);
                } else if (operator === "<") {
                    filteredData = filteredData.filter((point) => point[key] < filterValue);
                } else if (operator === "=") {
                    filteredData = filteredData.filter((point) => point[key] === filterValue);
                }
            });
        }

        if (filteredData.length === 0) {
            return { error: "Non-existent fields" };
        }

        const aggregatedData = {};

        query.aggregate.forEach((metric) => {
            if (metric === "sum") {
                aggregatedData.sum = filteredData.reduce((acc, point) => acc + point.value, 0);
            } else if (metric === "average") {
                aggregatedData.average = filteredData.reduce((acc, point) => acc + point.value, 0) / filteredData.length;
            } else if (metric === "min") {
                aggregatedData.min = Math.min(...filteredData.map((point) => point.value));
            } else if (metric === "max") {
                aggregatedData.max = Math.max(...filteredData.map((point) => point.value));
            }
        });

        return aggregatedData;
    }
}

module.exports = { DataAggregator };