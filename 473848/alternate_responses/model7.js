class DataAggregator {
    constructor() {
        this.data = [];
    }

    addDataPoint(dataPoint) {
        if (!dataPoint.id) {
            throw new Error("Field 'id' is required");
        }

        const existingIndex = this.data.findIndex((point) => point.id === dataPoint.id);

        if (existingIndex !== -1) {
            if (dataPoint.timestamp > this.data[existingIndex].timestamp) {
                this.data[existingIndex] = dataPoint;
            }
            return;
        }

        this.data.push(dataPoint);
        this.data.sort((a, b) => a.timestamp - b.timestamp);
    }

    getAggregatedData(query) {
        const filteredData = this.filterData(query.filter);
        const aggregatedData = this.aggregateData(filteredData, query.aggregate);

        if (Object.keys(aggregatedData).length === 0) {
            return { error: "Non-existent fields" };
        }

        return aggregatedData;
    }

    filterData(filter) {
        return this.data.filter((dataPoint) => {
            for (const [field, condition] of Object.entries(filter)) {
                if (!dataPoint[field]) {
                    return false;
                }

                const [operator, value] = condition.split(" ");
                const dataValue = dataPoint[field];

                switch (operator) {
                    case ">":
                        if (dataValue <= value) return false;
                        break;
                    case "<":
                        if (dataValue >= value) return false;
                        break;
                    case "=":
                        if (dataValue !== value) return false;
                        break;
                    default:
                        return false;
                }
            }
            return true;
        });
    }

    aggregateData(data, aggregate) {
        const aggregatedData = {};

        for (const metric of aggregate) {
            switch (metric) {
                case "sum":
                    aggregatedData.sum = data.reduce((acc, curr) => acc + curr.value, 0);
                    break;
                case "average":
                    aggregatedData.average = data.reduce((acc, curr) => acc + curr.value, 0) / data.length;
                    break;
                case "min":
                    aggregatedData.min = Math.min(...data.map((point) => point.value));
                    break;
                case "max":
                    aggregatedData.max = Math.max(...data.map((point) => point.value));
                    break;
                default:
                    throw new Error(`Invalid aggregation metric: ${metric}`);
            }
        }

        return aggregatedData;
    }
}

module.exports = { DataAggregator };