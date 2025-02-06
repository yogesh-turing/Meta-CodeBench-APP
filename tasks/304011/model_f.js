const fs = require('fs-extra');

async function filterExistingFiles(filePaths) {
    const validFiles = [];
    await Promise.all(filePaths.map(async (filePath) => {
        try {
            const exists = await fs.pathExists(filePath);
            if (exists) {
                validFiles.push(filePath);
            }
        } catch (error) {
            console.error(`Error checking file ${filePath}:`, error);
        }
    }));
    return validFiles;
}

async function readFiles(filePaths) {
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

async function transformFiles(fileContents, transformFn) {
    return fileContents.map((content) => {
        try {
            return content ? transformFn(content) : null;
        } catch (error) {
            console.error('Error transforming file content:', error);
            return null;
        }
    });
}

async function writeFiles(filePaths, contents) {
    await Promise.all(filePaths.map(async (filePath, index) => {
        try {
            await fs.writeFile(filePath, contents[index], 'utf8');
        } catch (error) {
            console.error(`Error writing file ${filePath}:`, error);
        }
    }));
}

async function processFiles(filePaths, transformFn) {
    try {
        const validFiles = await filterExistingFiles(filePaths);
        const fileContents = await readFiles(validFiles);
        const transformedContents = await transformFiles(fileContents, transformFn);
        await writeFiles(validFiles, transformedContents);
        console.log('File processing completed.');
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

module.exports = {
    processFiles
};