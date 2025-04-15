const fs = require('fs-extra');
const path = require('path');

/**
 * Schedules cleanup of temp files using a pluggable deletion engine.
 *
 * @param {Object} options - Configuration object
 * @param {string} options.tempDir - Directory to monitor for deletion
 * @param {number} options.ttl - Time in ms after which files are deleted
 * @param {Function} options.logger - A logging function
 * @param {Function} [options.filterFn] - Optional filter function to select deletable files
 * @param {number} [options.maxRetries=3] - Max number of retries for deletion
 * @param {Function} [options.retryDelayStrategy] - Function returning delay between retries
 * 
 * @returns {Object} An object with methods:
 *   - schedule(filePath: string): void
 *   - cancel(filePath: string): void
 *   - getScheduled(): string[]
 */
function scheduleAndCleanFileStore({
    tempDir,
    ttl,
    logger,
    filterFn = () => true,
    maxRetries = 3,
    retryDelayStrategy = attempt => 1000 * Math.pow(2, attempt), // exponential backoff
}) {
    const scheduled = new Map(); // filepath → timeoutRef

    const createDeletionTask = (filePath) => {
        let attempts = 0;

        async function attemptDelete(resolve, reject) {
            if (attempts >= (maxRetries+1)) {
                logger(`Max retries reached for ${filePath}`);
                return reject(new Error('Max retries reached'));
            }

            try {
                await fs.remove(filePath);
                logger(`Deleted: ${filePath}`);
                resolve(true);
            } catch (err) {
                attempts++;
                logger(`Retry ${attempts} for ${filePath}: ${err.message}`);
                setTimeout(() => attemptDelete(resolve, reject), retryDelayStrategy(attempts));
            }
        }

        return () => new Promise(attemptDelete);
    };

    return {
        schedule(filePath) {
            if (!filterFn(filePath)) return;
            if (scheduled.has(filePath)) return;

            const timeoutRef = setTimeout(async () => {
                const deleteTask = createDeletionTask(filePath);
                try {
                    await deleteTask();
                } catch (e) {
                    logger(`Failed final delete for ${filePath}: ${e.message}`);
                } finally {
                    scheduled.delete(filePath);
                }
            }, ttl);

            scheduled.set(filePath, timeoutRef);
            logger(`Scheduled deletion for ${filePath}`);
        },

        cancel(filePath) {
            const ref = scheduled.get(filePath);
            if (ref) {
                clearTimeout(ref);
                scheduled.delete(filePath);
                logger(`Cancelled deletion for ${filePath}`);
            }
        },

        getScheduled() {
            return Array.from(scheduled.keys());
        }
    };
}

module.exports = { scheduleAndCleanFileStore };