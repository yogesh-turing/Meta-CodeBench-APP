const fs = require('fs-extra');

// Reusable function to check if a file exists
async function checkFileExists(filePath) {
    try {
        return await fs.pathExists(filePath);
    } catch (error) {
        console.error(`Error checking file ${filePath}:`, error);
        return false;
    }
}

// Reusable function to read file contents
async function readFileContents(filePath) {
    try {
        return await fs.readFile(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return null;
    }
}

// Reusable function to write file contents
async function writeFileContents(filePath, contents) {
    try {
        await fs.writeFile(filePath, contents, 'utf8');
    } catch (error) {
        console.error(`Error writing file ${filePath}:`, error);
    }
}

// Reusable function to apply transformation to file contents
function transformFileContents(contents, transformFn) {
    return contents ? transformFn(contents) : null;
}

// Main function to process files
async function processFiles(filePaths, transformFn) {
    // Filter out non-existent files in parallel
    const validFiles = await Promise.all(filePaths.map(async (filePath) => {
        const exists = await checkFileExists(filePath);
        return exists ? filePath : null;
    }));
    const filteredFiles = validFiles.filter((file) => file !== null);

    // Read file contents in parallel
    const fileContents = await Promise.all(filteredFiles.map(readFileContents));

    // Apply transformation to file contents
    const transformedContents = fileContents.map((contents) => transformFileContents(contents, transformFn));

    // Write transformed contents to files in parallel
    await Promise.all(filteredFiles.map((filePath, index) => writeFileContents(filePath, transformedContents[index])));

    console.log('File processing completed.');
}

module.exports = {
    processFiles
};