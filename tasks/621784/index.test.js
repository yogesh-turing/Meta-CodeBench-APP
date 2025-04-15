const fs = require('fs-extra');
const path = require('path');
const { scheduleAndCleanFileStore } = require('./model_a');

jest.mock('fs-extra');

describe('scheduleAndCleanFileStore', () => {
    let logs = [];

    const logger = msg => logs.push(msg);

    beforeEach(() => {
        logs = [];
        jest.useFakeTimers();
        jest.clearAllTimers();
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('schedules and deletes a file successfully after TTL', async () => {
        fs.remove.mockResolvedValueOnce(); // simulate success

        const store = scheduleAndCleanFileStore({
            tempDir: '/tmp',
            ttl: 1000,
            logger
        });

        const filePath = '/tmp/testfile.txt';
        store.schedule(filePath);

        expect(store.getScheduled()).toContain(filePath);
        jest.advanceTimersByTime(1000);
        await Promise.resolve(); // flush promise

        expect(fs.remove).toHaveBeenCalledWith(filePath);

        // add wait for fs.remove to resolve
        await Promise.resolve(); // flush promise
        expect(fs.remove).toHaveBeenCalledTimes(1);
        expect(store.getScheduled()).not.toContain(filePath);
        expect(logs).toContain(`Deleted: ${filePath}`);
    });

    test('retries deletion if fs.remove fails', async () => {
        fs.remove
            .mockRejectedValueOnce(new Error('EPERM: file in use'))
            .mockResolvedValueOnce(); // succeed on 2nd try

        const store = scheduleAndCleanFileStore({
            tempDir: '/tmp',
            ttl: 1000,
            logger,
            maxRetries: 3,
            retryDelayStrategy: attempt => 500
        });

        const filePath = '/tmp/retryfile.txt';
        store.schedule(filePath);

        jest.advanceTimersByTime(1000); // trigger initial deletion
        await Promise.resolve();

        expect(fs.remove).toHaveBeenCalledTimes(1);
        await Promise.resolve(); // flush promise
        const index = logs.findIndex(l => l.includes('Retry 1 for'));
        expect(index).toBeGreaterThan(-1); // check retry log

        jest.advanceTimersByTime(500); // trigger retry
        await Promise.resolve();

        expect(fs.remove).toHaveBeenCalledTimes(2);
        expect(logs).toContain(`Deleted: ${filePath}`);
    });

    test('gives up after max retries', async () => {
        fs.remove.mockRejectedValue(new Error('EACCESS'));

        const store = scheduleAndCleanFileStore({
            tempDir: '/tmp',
            ttl: 1000,
            logger,
            maxRetries: 2,
            retryDelayStrategy: attempt => 300
        });

        const filePath = '/tmp/failfile.txt';
        store.schedule(filePath);

        jest.advanceTimersByTime(1000); // initial
        await Promise.resolve();

        jest.advanceTimersByTime(300); // retry 1
        await Promise.resolve();

        jest.advanceTimersByTime(300); // retry 2
        await Promise.resolve();

        expect(fs.remove).toHaveBeenCalledTimes(3);
    });

    test('cancels a scheduled file deletion', () => {
        const store = scheduleAndCleanFileStore({
            tempDir: '/tmp',
            ttl: 5000,
            logger
        });

        const filePath = '/tmp/killme.txt';
        store.schedule(filePath);

        expect(store.getScheduled()).toContain(filePath);

        store.cancel(filePath);

        expect(store.getScheduled()).not.toContain(filePath);
        expect(logs).toContain(`Cancelled deletion for ${filePath}`);
    });

    test('skips schedule if filterFn returns false', () => {
        const store = scheduleAndCleanFileStore({
            tempDir: '/tmp',
            ttl: 1000,
            logger,
            filterFn: (filePath) => !filePath.includes('skip')
        });

        const filePath = '/tmp/skip-this.txt';
        store.schedule(filePath);

        expect(store.getScheduled()).not.toContain(filePath);
        expect(logs).not.toContain(`Scheduled deletion for ${filePath}`);
    });
});
