const fs = require('fs-extra');

async function filterExistingFiles(filePaths) {
    const promises = filePaths.map(async (filePath) => {
        try {
            const exists = await fs.pathExists(filePath);
            return exists ? filePath : null;
        } catch (error) {
            console.error('Error checking file:', error);
            return null;
        }
    });

    const results = await Promise.all(promises);
    return results.filter((filePath) => filePath !== null);
}

async function readFiles(filePaths) {
    const promises = filePaths.map(async (filePath) => {
        try {
            return await fs.readFile(filePath, 'utf8');
        } catch (error) {
            console.error('Error reading file:', error);
            return null;
        }
    });

    return await Promise.all(promises);
}

async function transformContents(fileContents, transformFn) {
    return fileContents.map((content) => (content ? transformFn(content) : null));
}

async function writeFiles(filePaths, contents) {
    const promises = filePaths.map(async (filePath, index) => {
        try {
            await fs.writeFile(filePath, contents[index], 'utf8');
        } catch (error) {
            console.error('Error writing file:', error);
        }
    });

    await Promise.all(promises);
}

async function processFiles(filePaths, transformFn) {
    const existingFiles = await filterExistingFiles(filePaths);
    const fileContents = await readFiles(existingFiles);
    const transformedContents = await transformContents(fileContents, transformFn);
    await writeFiles(existingFiles, transformedContents);

    console.log('File processing completed.');
}

module.exports = {
    processFiles
};