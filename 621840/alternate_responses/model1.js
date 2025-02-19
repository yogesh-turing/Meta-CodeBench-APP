class DataFrameComparator {
    static compareDataFrames(df1, df2) {
        if (!Array.isArray(df1) || !Array.isArray(df2)) {
            throw new Error("Input DataFrames must be arrays.");
        }
        if (df1.length !== df2.length) {
            throw new Error("DataFrames must have same number of columns.");
        }

        return df1.map((col1, index) => {
            const col2 = df2[index];
            return this.compareColumns(col1, col2);
        });
    }

    static compareColumns(col1, col2) {
        if (!Array.isArray(col1) || !Array.isArray(col2)) {
            throw new Error("Columns must be arrays.");
        }
        if (col1.length !== col2.length) {
            throw new Error("Columns must have same number of rows.");
        }

        // Handle empty columns
        if (!col1.length || !col2.length) {
            return 1.0;
        }

        // Check for type compatibility
        if (typeof col1[0] !== typeof col2[0]) {
            return 0.0;
        }

        if (typeof col1[0] === "string") {
            return this.compareStringColumns(col1, col2);
        } else if (typeof col1[0] === "number" || typeof col1[0] === "boolean") {
            return this.compareNumericBooleanColumns(col1, col2);
        } else {
            throw new Error("Unsupported data type: " + typeof col1[0]);
        }
    }

    static compareStringColumns(col1, col2) {
        const differences = col1.reduce((count, val, index) => 
            count + (val !== col2[index] ? 1 : 0), 0);
        return (col1.length - differences) / col1.length;
    }

    static compareNumericBooleanColumns(col1, col2) {
        const normalizedCol1 = this.normalizeColumn(col1);
        const normalizedCol2 = this.normalizeColumn(col2);

        const distance = Math.sqrt(
            normalizedCol1.reduce((sum, val, index) => 
                sum + Math.pow(val - normalizedCol2[index], 2), 0)
        );

        return 1 / (1 + distance);
    }

    static normalizeColumn(column) {
        if (!Array.isArray(column)) {
            throw new Error("Column must be an array.");
        }
        if (!column.length) {
            throw new Error("Column is empty.");
        }
        if (column.some(val => val === null || val === undefined)) {
            throw new Error("Column contains null or undefined values.");
        }

        if (typeof column[0] === "number") {
            const min = Math.min(...column);
            const max = Math.max(...column);
            const range = max - min;

            return column.map(val => 
                range > 0 ? (val - min) / range : 0.0
            );
        } else if (typeof column[0] === "boolean") {
            return column.map(val => val ? 1.0 : 0.0);
        } else {
            throw new Error("Unsupported data type: " + typeof column[0]);
        }
    }
}

module.exports = { DataFrameComparator };