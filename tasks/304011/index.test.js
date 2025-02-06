const fs = require('fs-extra');
// const {processFiles} = require(process.env.TARGET_FILE);
const {processFiles} = require('./correct');

jest.mock('fs-extra');
global.console = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }

describe('processFiles function', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Processes valid files and applies transformation', async () => {
        const filePaths = ['file1.txt', 'file2.txt'];

        // Mock existing files
        fs.pathExists.mockImplementation(async (file) => filePaths.includes(file));

        // Mock file contents
        fs.readFile.mockImplementation(async (file) => {
            if (file === 'file1.txt') return 'hello';
            if (file === 'file2.txt') return 'world';
            return '';
        });

        // Mock writing to files
        fs.writeFile.mockImplementation(async () => {});

        // Transformation function
        const mockTransform = (content) => content.toUpperCase();

        await processFiles(filePaths, mockTransform);

        // Check if file reads happened
        expect(fs.readFile).toHaveBeenCalledTimes(2);

        // Check if transformed content was written back
        expect(fs.writeFile).toHaveBeenCalledWith('file1.txt', 'HELLO', 'utf8');
        expect(fs.writeFile).toHaveBeenCalledWith('file2.txt', 'WORLD', 'utf8');
    });

    test('Skips non-existent files', async () => {
        const filePaths = ['file1.txt', 'file2.txt'];

        // Mock only one file exists
        fs.pathExists.mockImplementation(async (file) => file === 'file1.txt');

        fs.readFile.mockImplementation(async (file) => (file === 'file1.txt' ? 'hello' : ''));

        fs.writeFile.mockImplementation(async () => {});

        const mockTransform = (content) => content.toUpperCase();

        await processFiles(filePaths, mockTransform);

        expect(fs.readFile).toHaveBeenCalledTimes(1);
        expect(fs.writeFile).toHaveBeenCalledWith('file1.txt', 'HELLO', 'utf8');
        expect(fs.writeFile).not.toHaveBeenCalledWith('file2.txt', expect.anything());
    });

    test('Handles read file errors gracefully', async () => {
        const filePaths = ['file1.txt'];

        fs.pathExists.mockResolvedValue(true);
        fs.readFile.mockRejectedValue(new Error('Read error'));

        fs.writeFile.mockImplementation(async () => {});

        const mockTransform = (content) => content.toUpperCase();

        await processFiles(filePaths, mockTransform);

        expect(fs.writeFile).not.toHaveBeenCalled();
    });

    test('Handles write file errors gracefully', async () => {
        const filePaths = ['file1.txt'];

        fs.pathExists.mockResolvedValue(true);
        fs.readFile.mockResolvedValue('hello');
        fs.writeFile.mockRejectedValue(new Error('Write error'));

        const mockTransform = (content) => content.toUpperCase();

        await processFiles(filePaths, mockTransform);

        expect(fs.readFile).toHaveBeenCalledTimes(1);
        expect(fs.writeFile).toHaveBeenCalledTimes(1);
    });

    test('Processes empty file correctly', async () => {
        const filePaths = ['empty.txt'];

        fs.pathExists.mockResolvedValue(true);
        fs.readFile.mockResolvedValue('');
        fs.writeFile.mockImplementation(async () => {});

        const mockTransform = (content) => content.toUpperCase();

        await processFiles(filePaths, mockTransform);

        expect(fs.readFile).toHaveBeenCalledWith('empty.txt', 'utf8');
    });

    test('Handles non-string transformations', async () => {
        const filePaths = ['file1.txt'];

        fs.pathExists.mockResolvedValue(true);
        fs.readFile.mockResolvedValue('hello');

        const mockTransform = () => 12345; // Invalid transformation

        await processFiles(filePaths, mockTransform);

        expect(fs.writeFile).toHaveBeenCalledWith('file1.txt', '12345', 'utf8');
    });


    test('Processes valid files and applies complex transformation', async () => {
        const filePaths = ['file1.txt', 'file2.txt'];

        // Mock existing files
        fs.pathExists.mockImplementation(async (file) => filePaths.includes(file));

        // Mock file contents
        fs.readFile.mockImplementation(async (file) => {
            if (file === 'file1.txt') return 'hello testing team';
            if (file === 'file2.txt') return 'world is awesome';
            return '';
        });

        // Mock writing to files
        fs.writeFile.mockImplementation(async () => {});

        // Transformation function
        const mockTransform = (content) => {
            return content.split(' ').map((word, index) => {
                return index % 2 === 0 ? word.toUpperCase() : word;
            }).join('_');
        };

        await processFiles(filePaths, mockTransform);

        // Check if file reads happened
        expect(fs.readFile).toHaveBeenCalledTimes(2);

        // Check if transformed content was written back
        expect(fs.writeFile).toHaveBeenCalledWith('file1.txt', 'HELLO_testing_TEAM', 'utf8');
        expect(fs.writeFile).toHaveBeenCalledWith('file2.txt', 'WORLD_is_AWESOME', 'utf8');
    });

});
