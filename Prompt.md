Refactor a JavaScript DataFrame comparison tool to make it more modular by splitting functionality into specific methods:

- `compareDataFrames:` Compare two DataFrames (arrays of arrays) and calculate a similarity score for each column. Return an array of scores, where each score corresponds to the similarity of the respective columns. Throw an error if the `DataFrames` have different numbers of columns.

- `compareColumns:` Calculate the similarity score between two columns (arrays) based on their data type. Throw an error if the columns have different sizes or incompatible data types.

- `compareStringColumns:` Compare two columns of strings and calculate the similarity score as the proportion of matching strings.

- `compareNumericBooleanColumns:` Compare two numeric or boolean columns by calculating their similarity score using the Euclidean distance between normalized values.

- `normalizeColumn:` Normalize a column of numeric or boolean values and return an array of normalized values. Throw an error if the column is empty, contain null value  or contains unsupported data types.

Implement these static methods using class in JavaScript while ensuring they handle edge cases and errors effectively. Use module.exports = { DataFrameComparator }; when exporting.