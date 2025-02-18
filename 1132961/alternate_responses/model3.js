class ThreadSafeResourceManager {
    constructor(defaultTimeout = 5000) {
      this.cache = new Map();
      this.defaultTimeout = defaultTimeout;
      this.activeReaders = new Set();
      this.activeWriter = null;
      this.writerQueue = [];
      this.readerQueue = [];
    }
  
    async addResource(key, resource, timeout = this.defaultTimeout) {
      const release = await this._acquireWriteLock(key, timeout);
      try {
        if (resource === null) {
          throw new Error('Invalid resource');
        }
        this.cache.set(key, resource);
      } finally {
        release();
      }
    }
  
    async getResource(key, timeout = this.defaultTimeout) {
      const release = await this._acquireReadLock(key, timeout);
      try {
        return this.cache.get(key) || null;
      } finally {
        release();
      }
    }
  
    async removeResource(key, timeout = this.defaultTimeout) {
      const release = await this._acquireWriteLock(key, timeout);
      try {
        this.cache.delete(key);
      } finally {
        release();
      }
    }
  
    async _acquireReadLock(key, timeout) {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Lock acquisition timeout')), timeout);
      });
  
      const lockPromise = new Promise((resolve, reject) => {
        const tryAcquire = () => {
          if (!this.activeWriter && this.writerQueue.length === 0) {
            this.activeReaders.add(key);
            resolve(() => this._releaseReadLock(key));
          } else {
            this.readerQueue.push({ key, resolve: () => {
              this.activeReaders.add(key);
              resolve(() => this._releaseReadLock(key));
            }});
          }
        };
  
        tryAcquire();
      });
  
      return Promise.race([lockPromise, timeoutPromise]);
    }
  
    async _acquireWriteLock(key, timeout) {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Lock acquisition timeout')), timeout);
      });
  
      const lockPromise = new Promise((resolve, reject) => {
        const tryAcquire = () => {
          if (!this.activeWriter && this.activeReaders.size === 0) {
            this.activeWriter = key;
            resolve(() => this._releaseWriteLock(key));
          } else {
            this.writerQueue.push({ key, resolve: () => {
              this.activeWriter = key;
              resolve(() => this._releaseWriteLock(key));
            }});
          }
        };
  
        tryAcquire();
      });
  
      return Promise.race([lockPromise, timeoutPromise]);
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
        nextWriter.resolve();
      } else {
        // Process all waiting readers
        while (this.readerQueue.length > 0) {
          const nextReader = this.readerQueue.shift();
          nextReader.resolve();
        }
      }
    }
  }
  
  module.exports = { ThreadSafeResourceManager };