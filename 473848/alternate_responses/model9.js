class DataAggregator {
    constructor() {
        this.data = [];
    }

    addDataPoint(dataPoint) {
        if (!dataPoint.id || !dataPoint.timestamp) {
            throw new Error("Field 'id' and 'timestamp' are required");
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
        const filteredData = this.data.filter((dataPoint) => {
            for (const field in query.filter) {
                if (!dataPoint[field]) {
                    return false;
                }
                const [operator, value] = query.filter[field].split(/([<>]=?|==|!=)/);
                switch (operator) {
                    case ">":
                        if (dataPoint[field] <= value) return false;
                        break;
                    case "<":
                        if (dataPoint[field] >= value) return false;
                        break;
                    case ">=":
                        if (dataPoint[field] < value) return false;
                        break;
                    case "<=":
                        if (dataPoint[field] > value) return false;
                        break;
                    case "==":
                        if (dataPoint[field] !== value) return false;
                        break;
                    case "!=":
                        if (dataPoint[field] === value) return false;
                        break;
                    default:
                        return false;
                }
            }
            return true;
        });

        if (filteredData.length === 0) {
            return { error: "No data found" };
        }

        const aggregatedData = {};
        for (const metric of query.aggregate) {
            switch (metric) {
                case "sum":
                    aggregatedData.sum = filteredData.reduce((acc, current) => acc + current.value, 0);
                    break;
                case "average":
                    aggregatedData.average = filteredData.reduce((acc, current) => acc + current.value, 0) / filteredData.length;
                    break;
                case "min":
                    aggregatedData.min = Math.min(...filteredData.map((dataPoint) => dataPoint.value));
                    break;
                case "max":
                    aggregatedData.max = Math.max(...filteredData.map((dataPoint) => dataPoint.value));
                    break;
                default:
                    return { error: "Invalid aggregation metric" };
            }
        }

        return aggregatedData;
    }
}

module.exports = { DataAggregator };