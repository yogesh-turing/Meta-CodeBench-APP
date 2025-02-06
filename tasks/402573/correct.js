const fs = require('fs-extra');

/**
 * Reads the content of multiple files asynchronously.
 *
 * @param {string[]} files - An array of file paths to read.
 * @returns {Promise<string[]>} A promise that resolves to an array of file contents.
 * @throws Will throw an error if any file cannot be read.
 */
const readFiles = async (files) => {
    return await Promise.all(
        files.map(async (file) => {
            try {
                return await fs.readFile(file, 'utf8');
            } catch (err) {
                console.error(`Error reading file ${file}:`, err.message);
                throw err;
            }
        })
    );
}

/**
 * Writes contents to multiple files asynchronously.
 *
 * @param {string[]} files - An array of file paths where the contents should be written.
 * @param {string[]} contents - An array of contents to be written to the files. Each index corresponds to the file at the same index in the `files` array.
 * @returns {Promise<void>} A promise that resolves when all files have been written.
 */
const writeFiles = async (files, contents) => {
    await Promise.all(
        files.map(async (file, index) => {
            try {
                await fs.writeFile(file, `${contents[index]}`, 'utf8');
            } catch (err) {
                console.error(`Error writing file ${file}:`, err.message);
            }
        })
    );
}

/**
 * Filters an array of file paths, returning only the paths that exist.
 *
 * @param {string[]} filePaths - An array of file paths to check.
 * @returns {Promise<string[]>} A promise that resolves to an array of existing file paths.
 * @throws Will throw an error if there is an issue checking any of the file paths.
 */
const filterExistingFiles = async (filePaths) => {
    return await Promise.all(
        filePaths.map(async (file) => {
            try {
                return (await fs.pathExists(file)) ? file : null;
            } catch (err) {
                console.error(`Error checking file ${file}:`, err.message);
                throw err;
            }
        })
    ).then(files => files.filter(file => file !== null));
}

/**
 * Reads, transforms, and writes back content for multiple files asynchronously.
 * Uses parallel execution, enhanced error handling, and logging.
 *
 * @param {string[]} filePaths - Array of file paths to process.
 * @param {Function} transformFn - Function to apply transformations to file content.
 */
async function processFiles(filePaths, transformFn) {
    try {
        if (!transformFn || typeof transformFn !== 'function') {
            throw new Error('Transformation function is required.');
        }
        // Step 1: Filter existing files in parallel
        const validFiles = await filterExistingFiles(filePaths);
        if (validFiles.length === 0) {
            return;
        }
        // Step 2: Read file contents in parallel
        const fileContents = await readFiles(validFiles);

        // Step 3: Apply transformation using a higher-order function
        const transformedContents = fileContents.map(content => {
            transformFn = transformFn || (content => content);
            return (content != null || content != undefined) ? transformFn(content) : null;
        });

        // Step 4: Write transformed content back in parallel
        await writeFiles(validFiles, transformedContents);
    } catch (error) {
        console.log('Unexpected error:', error.message);
        return;
    }
}

module.exports = {
    processFiles
};
