class DataAggregator {
    constructor() {
        this.data = [];
    }

    addDataPoint(dataPoint) {
        const existingIndex = this.data.findIndex((point) => point.id === dataPoint.id);

        if (existingIndex !== -1) {
            if (this.data[existingIndex].timestamp < dataPoint.timestamp) {
                this.data[existingIndex] = dataPoint;
            }
            return;
        }

        this.data.push(dataPoint);
        this.data.sort((a, b) => a.timestamp - b.timestamp);
    }

    getAggregatedData(query) {
        const filteredData = this.filterData(query.filter);
        if (!filteredData.length) return { error: "No data found" };

        const aggregatedData = this.aggregateData(filteredData, query.aggregate);
        return aggregatedData;
    }

    filterData(filter) {
        const filteredData = this.data.filter((dataPoint) => {
            for (const [key, value] of Object.entries(filter)) {
                if (!dataPoint[key]) return false;

                const [operator, threshold] = value.split(/([<>])/);
                switch (operator) {
                    case ">":
                        if (dataPoint[key] <= threshold) return false;
                        break;
                    case "<":
                        if (dataPoint[key] >= threshold) return false;
                        break;
                    case "=":
                        if (dataPoint[key] !== threshold) return false;
                        break;
                    default:
                        return false;
                }
            }
            return true;
        });
        return filteredData;
    }

    aggregateData(data, aggregate) {
        const aggregatedData = {};

        for (const metric of aggregate) {
            switch (metric) {
                case "average":
                    aggregatedData.average = this.calculateAverage(data);
                    break;
                case "min":
                    aggregatedData.min = this.calculateMin(data);
                    break;
                case "max":
                    aggregatedData.max = this.calculateMax(data);
                    break;
                case "sum":
                    aggregatedData.sum = this.calculateSum(data);
                    break;
                default:
                    return { error: `Invalid aggregate metric: ${metric}` };
            }
        }
        return aggregatedData;
    }

    calculateAverage(data) {
        const sum = data.reduce((acc, current) => acc + current.value, 0);
        return sum / data.length;
    }

    calculateMin(data) {
        return Math.min(...data.map((point) => point.value));
    }

    calculateMax(data) {
        return Math.max(...data.map((point) => point.value));
    }

    calculateSum(data) {
        return data.reduce((acc, current) => acc + current.value, 0);
    }
}

module.exports = { DataAggregator };