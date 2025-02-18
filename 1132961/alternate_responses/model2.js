class ThreadSafeResourceManager {
    constructor() {
      this.cache = new Map();
      this.activeReaders = new Set();
      this.activeWriter = null;
      this.writerQueue = [];
      this.readerQueue = [];
      this.DEFAULT_TIMEOUT = 5000; // 5 seconds default timeout
    }
  
    async addResource(key, resource, timeout = this.DEFAULT_TIMEOUT) {
      const release = await this._acquireWriteLock(key, timeout);
      try {
        if (resource === null) {
          throw new Error('Invalid resource: null is not allowed');
        }
        this.cache.set(key, resource);
      } finally {
        release();
      }
    }
  
    async getResource(key, timeout = this.DEFAULT_TIMEOUT) {
      const release = await this._acquireReadLock(key, timeout);
      try {
        return this.cache.get(key) || null;
      } finally {
        release();
      }
    }
  
    async removeResource(key, timeout = this.DEFAULT_TIMEOUT) {
      const release = await this._acquireWriteLock(key, timeout);
      try {
        this.cache.delete(key);
      } finally {
        release();
      }
    }
  
    async _acquireReadLock(key, timeout) {
      const timeoutPromise = this._createTimeout(timeout);
      const lockPromise = new Promise((resolve, reject) => {
        const attemptLock = async () => {
          if (this.activeWriter || this.writerQueue.length > 0) {
            this.readerQueue.push({ resolve, reject });
          } else {
            this.activeReaders.add(key);
            resolve();
          }
        };
        attemptLock();
      });
  
      try {
        await Promise.race([lockPromise, timeoutPromise]);
      } catch (error) {
        throw new Error(`Failed to acquire read lock: ${error.message}`);
      }
  
      return () => this._releaseReadLock(key);
    }
  
    async _acquireWriteLock(key, timeout) {
      const timeoutPromise = this._createTimeout(timeout);
      const lockPromise = new Promise((resolve, reject) => {
        const attemptLock = async () => {
          if (this.activeWriter || this.activeReaders.size > 0) {
            this.writerQueue.push({ resolve, reject });
          } else {
            this.activeWriter = key;
            resolve();
          }
        };
        attemptLock();
      });
  
      try {
        await Promise.race([lockPromise, timeoutPromise]);
      } catch (error) {
        throw new Error(`Failed to acquire write lock: ${error.message}`);
      }
  
      return () => this._releaseWriteLock(key);
    }
  
    _releaseReadLock(key) {
      this.activeReaders.delete(key);
      this._processNextLock();
    }
  
    _releaseWriteLock(key) {
      if (this.activeWriter === key) {
        this.activeWriter = null;
        this._processNextLock();
      }
    }
  
    _processNextLock() {
      if (this.activeWriter || this.activeReaders.size > 0) {
        return;
      }
  
      // Prioritize writers to prevent starvation
      if (this.writerQueue.length > 0) {
        const nextWriter = this.writerQueue.shift();
        this.activeWriter = true;
        nextWriter.resolve();
      } else {
        // Process all waiting readers
        while (this.readerQueue.length > 0) {
          const nextReader = this.readerQueue.shift();
          this.activeReaders.add(true);
          nextReader.resolve();
        }
      }
    }
  
    _createTimeout(timeout) {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Operation timed out after ${timeout}ms`));
        }, timeout);
      });
    }
  
    // Helper method to get internal state (for testing/debugging)
    getStatus() {
      return {
        activeReaders: this.activeReaders.size,
        activeWriter: !!this.activeWriter,
        pendingReaders: this.readerQueue.length,
        pendingWriters: this.writerQueue.length,
        cacheSize: this.cache.size
      };
    }
  }
  
  module.exports = { ThreadSafeResourceManager };