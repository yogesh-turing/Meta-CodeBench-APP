const fs = require('fs-extra');

async function filterExistingFiles(filePaths) {
    const existingFiles = [];
    for (const filePath of filePaths) {
        try {
            const exists = await fs.pathExists(filePath);
            if (exists) {
                existingFiles.push(filePath);
            }
        } catch (error) {
            console.error(`Error checking file ${filePath}:`, error);
        }
    }
    return existingFiles;
}

async function readFileContents(filePaths) {
    const fileContents = await Promise.all(filePaths.map(async (filePath) => {
        try {
            return await fs.readFile(filePath, 'utf8');
        } catch (error) {
            console.error(`Error reading file ${filePath}:`, error);
            return null;
        }
    }));
    return fileContents;
}

function transformFileContents(fileContents, transformFn) {
    return fileContents.map((content) => content ? transformFn(content) : null);
}

async function writeTransformedContents(filePaths, transformedContents) {
    await Promise.all(filePaths.map(async (filePath, index) => {
        try {
            await fs.writeFile(filePath, transformedContents[index], 'utf8');
        } catch (error) {
            console.error(`Error writing file ${filePath}:`, error);
        }
    }));
}

async function processFiles(filePaths, transformFn) {
    const existingFiles = await filterExistingFiles(filePaths);
    const fileContents = await readFileContents(existingFiles);
    const transformedContents = transformFileContents(fileContents, transformFn);
    await writeTransformedContents(existingFiles, transformedContents);
    console.log('File processing completed.');
}

module.exports = {
    processFiles
};