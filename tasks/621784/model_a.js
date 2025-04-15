const fs = require('fs-extra');
const path = require('path');

function scheduleAndCleanFileStore({
    tempDir,
    ttl,
    logger,
    filterFn = () => true,
    maxRetries = 3,
    retryDelayStrategy = attempt => 1000 * Math.pow(2, attempt),
}) {
    const scheduled = new Map();

    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const createDeletionTask = (filePath) => async () => {
        const fullPath = path.join(tempDir, filePath);
        let attempt = 0;

        while (attempt < maxRetries) {
            try {
                await fs.remove(fullPath);
                logger(`Successfully deleted ${filePath}`);
                return;
            } catch (error) {
                attempt++;
                if (attempt === maxRetries) {
                    throw new Error(`Failed to delete ${filePath} after ${maxRetries} attempts: ${error.message}`);
                }
                const delay = retryDelayStrategy(attempt);
                logger(`Deletion attempt ${attempt} failed for ${filePath}, retrying in ${delay}ms`);
                await sleep(delay);
            }
        }
    };

    const cleanupScheduled = (filePath) => {
        const ref = scheduled.get(filePath);
        if (ref) {
            clearTimeout(ref);
            scheduled.delete(filePath);
        }
    };

    return {
        schedule(filePath) {
            if (!filterFn(filePath)) {
                logger(`File ${filePath} filtered out from deletion`);
                return;
            }

            cleanupScheduled(filePath);

            const timeoutRef = setTimeout(async () => {
                const deleteTask = createDeletionTask(filePath);
                try {
                    await deleteTask();
                } catch (error) {
                    logger(`Failed final delete for ${filePath}: ${error.message}`);
                } finally {
                    scheduled.delete(filePath);
                }
            }, ttl);

            scheduled.set(filePath, timeoutRef);
            logger(`Scheduled deletion for ${filePath} in ${ttl}ms`);
        },

        cancel(filePath) {
            if (scheduled.has(filePath)) {
                cleanupScheduled(filePath);
                logger(`Cancelled deletion for ${filePath}`);
            }
        },

        getScheduled() {
            return Array.from(scheduled.keys());
        }
    };
}

module.exports = { scheduleAndCleanFileStore };