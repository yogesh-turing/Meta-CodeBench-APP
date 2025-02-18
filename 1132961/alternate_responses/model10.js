class ThreadSafeResourceManager {
    constructor() {
      this.cache = new Map();
      this.locks = new Map();
      this.readers = new Map();
      this.writerQueues = new Map();
      this.timeout = 5000; // Default timeout in milliseconds
    }
  
    async addResource(key, resource, timeout = this.timeout) {
      await this._acquireWriteLock(key, timeout);
      try {
        this.cache.set(key, resource);
      } finally {
        this._releaseWriteLock(key);
      }
    }
  
    async getResource(key, timeout = this.timeout) {
      await this._acquireReadLock(key, timeout);
      try {
        return this.cache.get(key) || null;
      } finally {
        this._releaseReadLock(key);
      }
    }
  
    async removeResource(key, timeout = this.timeout) {
      await this._acquireWriteLock(key, timeout);
      try {
        this.cache.delete(key);
      } finally {
        this._releaseWriteLock(key);
      }
    }
  
    async _acquireReadLock(key, timeout) {
      if (this.locks.has(key)) {
        await this._waitForLock(key, timeout);
      }
  
      if (!this.readers.has(key)) {
        this.readers.set(key, 0);
      }
  
      this.readers.set(key, this.readers.get(key) + 1);
  
      return () => {
        this.readers.set(key, this.readers.get(key) - 1);
        if (this.readers.get(key) === 0) {
          this.readers.delete(key);
        }
      };
    }
  
    async _acquireWriteLock(key, timeout) {
      if (this.locks.has(key) || this.readers.has(key)) {
        await this._waitForLock(key, timeout);
      }
  
      this.locks.set(key, true);
  
      return () => {
        this.locks.delete(key);
      };
    }
  
    async _waitForLock(key, timeout) {
      const startTime = Date.now();
      while (this.locks.has(key) || this.readers.has(key)) {
        await new Promise((resolve) => setTimeout(resolve, 10));
        if (Date.now() - startTime > timeout) {
          throw new Error(`Timeout acquiring lock for key ${key}`);
        }
      }
    }
  
    _releaseReadLock(key) {
      if (this.readers.has(key)) {
        this.readers.set(key, this.readers.get(key) - 1);
        if (this.readers.get(key) === 0) {
          this.readers.delete(key);
        }
      }
    }
  
    _releaseWriteLock(key) {
      if (this.locks.has(key)) {
        this.locks.delete(key);
      }
    }
  }
  
  module.exports = { ThreadSafeResourceManager };