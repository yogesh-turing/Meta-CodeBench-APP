const fs = require('fs-extra');

async function filterExistingFiles(filePaths) {
    const existingFiles = [];
    for (const filePath of filePaths) {
        try {
            if (await fs.pathExists(filePath)) {
                existingFiles.push(filePath);
            }
        } catch (error) {
            console.error(`Error checking file ${filePath}: ${error}`);
        }
    }
    return existingFiles;
}

async function readFile(filePath) {
    try {
        return await fs.readFile(filePath, 'utf8');
    } catch (error) {
        console.error(`Error reading file ${filePath}: ${error}`);
        return null;
    }
}

async function writeFile(filePath, content) {
    try {
        await fs.writeFile(filePath, content, 'utf8');
    } catch (error) {
        console.error(`Error writing file ${filePath}: ${error}`);
    }
}

async function processFiles(filePaths, transformFn) {
    const validFiles = await filterExistingFiles(filePaths);
    const fileContents = await Promise.all(validFiles.map(readFile));
    const transformedContents = fileContents.map((content) => (content ? transformFn(content) : null));
    await Promise.all(validFiles.map((filePath, index) => writeFile(filePath, transformedContents[index])));
    console.log('File processing completed.');
}

module.exports = {
    processFiles
};