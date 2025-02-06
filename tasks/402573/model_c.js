const fs = require('fs-extra');

class FileProcessingError extends Error {
    constructor(message, originalError) {
        super(message);
        this.name = 'FileProcessingError';
        this.originalError = originalError;
    }
}

async function validateFilePath(filePath) {
    try {
        const exists = await fs.pathExists(filePath);
        return exists ? filePath : null;
    } catch (error) {
        throw new FileProcessingError(`Error validating file path: ${filePath}`, error);
    }
}

async function readFileContent(filePath) {
    try {
        return await fs.readFile(filePath, 'utf8');
    } catch (error) {
        throw new FileProcessingError(`Error reading file: ${filePath}`, error);
    }
}

async function writeFileContent(filePath, content) {
    try {
        await fs.writeFile(filePath, content, 'utf8');
        return true;
    } catch (error) {
        throw new FileProcessingError(`Error writing file: ${filePath}`, error);
    }
}

async function processFiles(filePaths, transformFn) {
    if (!Array.isArray(filePaths) || !filePaths.length) {
        throw new Error('File paths must be a non-empty array');
    }
    if (typeof transformFn !== 'function') {
        throw new Error('Transform function must be provided');
    }

    try {
        // Validate files in parallel
        const validationResults = await Promise.all(
            filePaths.map(filePath => validateFilePath(filePath))
        );
        const validFiles = validationResults.filter(Boolean);

        if (validFiles.length === 0) {
            console.warn('No valid files found to process');
            return;
        }

        // Read files in parallel
        const fileContents = await Promise.all(
            validFiles.map(filePath => readFileContent(filePath))
        );

        // Transform contents
        const transformedContents = fileContents.map(content => 
            content ? transformFn(content) : null
        );

        // Write files in parallel
        await Promise.all(
            validFiles.map((filePath, index) => 
                writeFileContent(filePath, transformedContents[index])
            )
        );

        console.log(`Successfully processed ${validFiles.length} files`);
    } catch (error) {
        if (error instanceof FileProcessingError) {
            console.error(`File processing failed: ${error.message}`);
            console.error('Original error:', error.originalError);
        } else {
            console.error('Unexpected error during file processing:', error);
        }
        throw error; // Re-throw to allow calling code to handle the error
    }
}

module.exports = { processFiles };