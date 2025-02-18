class ThreadSafeResourceManager {
    constructor(defaultTimeout = 5000) {
      this.cache = new Map();
      this.activeReaders = new Set();
      this.activeWriter = null;
      this.writerQueue = [];
      this.readerQueue = [];
      this.defaultTimeout = defaultTimeout;
    }
  
    async addResource(key, resource, timeout = this.defaultTimeout) {
      if (!key) throw new Error('Key is required');
      await this._acquireWriteLock(key, timeout);
      try {
        this.cache.set(key, resource);
      } finally {
        await this._releaseWriteLock(key);
      }
    }
  
    async getResource(key, timeout = this.defaultTimeout) {
      if (!key) throw new Error('Key is required');
      await this._acquireReadLock(key, timeout);
      try {
        return this.cache.get(key) || null;
      } finally {
        await this._releaseReadLock(key);
      }
    }
  
    async removeResource(key, timeout = this.defaultTimeout) {
      if (!key) throw new Error('Key is required');
      await this._acquireWriteLock(key, timeout);
      try {
        this.cache.delete(key);
      } finally {
        await this._releaseWriteLock(key);
      }
    }
  
    async _acquireReadLock(key, timeout) {
      const startTime = Date.now();
      
      while (this.activeWriter || this.writerQueue.length > 0) {
        if (Date.now() - startTime > timeout) {
          throw new Error(`Timeout waiting for read lock on key: ${key}`);
        }
  
        await new Promise(resolve => {
          this.readerQueue.push(resolve);
        });
      }
  
      this.activeReaders.add(key);
    }
  
    async _releaseReadLock(key) {
      this.activeReaders.delete(key);
      
      if (this.activeReaders.size === 0 && this.writerQueue.length > 0) {
        const nextWriter = this.writerQueue.shift();
        if (nextWriter) nextWriter();
      }
    }
  
    async _acquireWriteLock(key, timeout) {
      const startTime = Date.now();
      
      while (this.activeWriter || this.activeReaders.size > 0) {
        if (Date.now() - startTime > timeout) {
          throw new Error(`Timeout waiting for write lock on key: ${key}`);
        }
  
        await new Promise(resolve => {
          this.writerQueue.push(resolve);
        });
      }
  
      this.activeWriter = key;
    }
  
    async _releaseWriteLock(key) {
      if (this.activeWriter === key) {
        this.activeWriter = null;
        
        // Prioritize writers over readers
        if (this.writerQueue.length > 0) {
          const nextWriter = this.writerQueue.shift();
          if (nextWriter) nextWriter();
        } else {
          // Release all waiting readers
          while (this.readerQueue.length > 0) {
            const nextReader = this.readerQueue.shift();
            if (nextReader) nextReader();
          }
        }
      }
    }
  
    // Helper method to get current lock status (useful for testing and monitoring)
    getLockStatus(key) {
      return {
        isReading: this.activeReaders.has(key),
        isWriting: this.activeWriter === key,
        pendingReaders: this.readerQueue.length,
        pendingWriters: this.writerQueue.length
      };
    }
  }
  
  module.exports = { ThreadSafeResourceManager };