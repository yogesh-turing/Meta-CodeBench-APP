const fs = require('fs-extra');

class FileProcessingError extends Error {
    constructor(message, originalError) {
        super(message);
        this.name = 'FileProcessingError';
        this.originalError = originalError;
    }
}

async function validateFilePaths(filePaths) {
    if (!Array.isArray(filePaths)) {
        throw new FileProcessingError('filePaths must be an array');
    }
    
    const fileExistsPromises = filePaths.map(async (path) => {
        try {
            const exists = await fs.pathExists(path);
            return exists ? path : null;
        } catch (error) {
            throw new FileProcessingError(`Error checking file path: ${path}`, error);
        }
    });

    const results = await Promise.all(fileExistsPromises);
    return results.filter(path => path !== null);
}

async function readFiles(validFiles) {
    const readPromises = validFiles.map(async (filePath) => {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            return { filePath, content };
        } catch (error) {
            throw new FileProcessingError(`Error reading file: ${filePath}`, error);
        }
    });

    return Promise.all(readPromises);
}

async function transformContents(fileContents, transformFn) {
    if (typeof transformFn !== 'function') {
        throw new FileProcessingError('transformFn must be a function');
    }

    return fileContents.map(({ filePath, content }) => ({
        filePath,
        content: transformFn(content)
    }));
}

async function writeFiles(transformedContents) {
    const writePromises = transformedContents.map(async ({ filePath, content }) => {
        try {
            await fs.writeFile(filePath, `${content}`, 'utf8');
            return true;
        } catch (error) {
            throw new FileProcessingError(`Error writing file: ${filePath}`, error);
        }
    });

    return Promise.all(writePromises);
}

async function processFiles(filePaths, transformFn) {
    try {
        // Validate and filter file paths
        const validFiles = await validateFilePaths(filePaths);
        if (validFiles.length === 0) {
            console.warn('No valid files found to process');
            return;
        }

        // Read all valid files
        const fileContents = await readFiles(validFiles);

        // Transform contents
        const transformedContents = await transformContents(fileContents, transformFn);

        // Write transformed contents back to files
        await writeFiles(transformedContents);

        console.log('File processing completed successfully.');
    } catch (error) {
        if (error instanceof FileProcessingError) {
            console.error(`File processing failed: ${error.message}`);
            if (error.originalError) {
                console.error('Original error:', error.originalError);
            }
        } else {
            console.error('Unexpected error during file processing:', error);
        }
        throw error;
    }
}

module.exports = { processFiles };