const fs = require('fs-extra');

async function processFiles(filePaths, transformFn) {
    const validFiles = [];
    for (let i = 0; i < filePaths.length; i++) {
        try {
            const exists = await fs.pathExists(filePaths[i]);
            if (exists) {
                validFiles.push(filePaths[i]);
            }
        } catch (error) {
            console.error('Error checking file:', error);
            return;
        }
    }

    const fileContents = [];
    for (let i = 0; i < validFiles.length; i++) {
        try {
            const data = await fs.readFile(validFiles[i], 'utf8');
            fileContents.push(data);
        } catch (error) {
            console.error('Error reading file:', error);
            return null;
        }
    }

    const transformedContents = [];
    for (let i = 0; i < fileContents.length; i++) {
        const transformed = fileContents[i] ? transformFn(fileContents[i]) : null;
        transformedContents.push(transformed);
        
    }

    for (let i = 0; i < validFiles.length; i++) {
        try {
            await fs.writeFile(validFiles[i], `${transformedContents[i]}`, 'utf8');
        } catch (error) {
            console.error('Error writing file:', error);
        }
    }

    console.log('File processing completed.');
}

module.exports = {
    processFiles
};
