const fs = require('fs-extra');

class FileProcessingError extends Error {
    constructor(message, filePath, originalError) {
        super(message);
        this.name = 'FileProcessingError';
        this.filePath = filePath;
        this.originalError = originalError;
    }
}

async function validateFile(filePath) {
    try {
        const exists = await fs.pathExists(filePath);
        return exists;
    } catch (error) {
        throw new FileProcessingError(
            `Error validating file path: ${filePath}`,
            filePath,
            error
        );
    }
}

async function readFileContent(filePath) {
    try {
        return await fs.readFile(filePath, 'utf8');
    } catch (error) {
        throw new FileProcessingError(
            `Error reading file: ${filePath}`,
            filePath,
            error
        );
    }
}

async function writeFileContent(filePath, content) {
    try {
        await fs.writeFile(filePath, content, 'utf8');
    } catch (error) {
        throw new FileProcessingError(
            `Error writing file: ${filePath}`,
            filePath,
            error
        );
    }
}

async function processFiles(filePaths, transformFn) {
    if (!Array.isArray(filePaths)) {
        throw new Error('filePaths must be an array');
    }
    if (typeof transformFn !== 'function') {
        throw new Error('transformFn must be a function');
    }

    // Validate files in parallel
    const validationResults = await Promise.all(
        filePaths.map(async (filePath) => {
            try {
                const isValid = await validateFile(filePath);
                return { filePath, isValid };
            } catch (error) {
                console.error(error.message);
                return { filePath, isValid: false };
            }
        })
    );

    const validFiles = validationResults
        .filter(result => result.isValid)
        .map(result => result.filePath);

    if (validFiles.length === 0) {
        console.log('No valid files to process');
        return;
    }

    // Process files in parallel
    const errors = [];
    await Promise.all(
        validFiles.map(async (filePath) => {
            try {
                const content = await readFileContent(filePath);
                const transformedContent = transformFn(content);
                await writeFileContent(filePath, transformedContent);
            } catch (error) {
                errors.push(error);
                console.error(`Failed to process ${filePath}:`, error.message);
            }
        })
    );

    if (errors.length > 0) {
        console.log(`Completed with ${errors.length} errors`);
    } else {
        console.log('File processing completed successfully.');
    }
}

module.exports = { processFiles };