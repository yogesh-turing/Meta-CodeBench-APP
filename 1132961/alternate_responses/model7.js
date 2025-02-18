class ThreadSafeResourceManager {
    constructor() {
      this.cache = new Map();
      this.locks = new Map();
      this.readers = new Map();
      this.writers = new Map();
      this.queues = new Map();
    }
  
    async addResource(key, resource, timeout = 1000) {
      await this._acquireWriteLock(key, timeout);
      try {
        this.cache.set(key, resource);
      } finally {
        this._releaseWriteLock(key);
      }
    }
  
    async getResource(key, timeout = 1000) {
      await this._acquireReadLock(key, timeout);
      try {
        return this.cache.get(key) || null;
      } finally {
        this._releaseReadLock(key);
      }
    }
  
    async removeResource(key, timeout = 1000) {
      await this._acquireWriteLock(key, timeout);
      try {
        this.cache.delete(key);
      } finally {
        this._releaseWriteLock(key);
      }
    }
  
    async _acquireReadLock(key, timeout) {
      const queue = this._getQueue(key);
      const readLock = await this._enqueueReadLock(key, queue, timeout);
  
      if (!readLock) {
        throw new Error(`Failed to acquire read lock for ${key} within ${timeout}ms`);
      }
  
      return readLock;
    }
  
    async _acquireWriteLock(key, timeout) {
      const queue = this._getQueue(key);
      const writeLock = await this._enqueueWriteLock(key, queue, timeout);
  
      if (!writeLock) {
        throw new Error(`Failed to acquire write lock for ${key} within ${timeout}ms`);
      }
  
      return writeLock;
    }
  
    async _enqueueReadLock(key, queue, timeout) {
      const readLockPromise = new Promise((resolve) => {
        queue.push({ type: 'read', resolve });
      });
  
      const timer = setTimeout(() => {
        const index = queue.findIndex((item) => item.resolve === readLockPromise.resolve);
        if (index !== -1) {
          queue.splice(index, 1);
          readLockPromise.resolve(null);
        }
      }, timeout);
  
      await readLockPromise;
  
      clearTimeout(timer);
  
      if (this.writers.has(key)) {
        await this.writers.get(key);
      }
  
      this.readers.set(key, (this.readers.get(key) || 0) + 1);
  
      return () => {
        this._releaseReadLock(key);
      };
    }
  
    async _enqueueWriteLock(key, queue, timeout) {
      const writeLockPromise = new Promise((resolve) => {
        queue.push({ type: 'write', resolve });
      });
  
      const timer = setTimeout(() => {
        const index = queue.findIndex((item) => item.resolve === writeLockPromise.resolve);
        if (index !== -1) {
          queue.splice(index, 1);
          writeLockPromise.resolve(null);
        }
      }, timeout);
  
      await writeLockPromise;
  
      clearTimeout(timer);
  
      if (this.readers.has(key) || this.writers.has(key)) {
        await this._waitForReadersAndWriters(key);
      }
  
      this.writers.set(key, new Promise((resolve) => {
        this._releaseWriteLock = resolve;
      }));
  
      return () => {
        this._releaseWriteLock(key);
      };
    }
  
    async _waitForReadersAndWriters(key) {
      if (this.readers.has(key)) {
        await new Promise((resolve) => {
          const intervalId = setInterval(() => {
            if (!this.readers.has(key)) {
              clearInterval(intervalId);
              resolve();
            }
          }, 10);
        });
      }
  
      if (this.writers.has(key)) {
        await this.writers.get(key);
      }
    }
  
    _releaseReadLock(key) {
      const readersCount = this.readers.get(key);
      if (readersCount === 1) {
        this.readers.delete(key);
      } else {
        this.readers.set(key, readersCount - 1);
      }
  
      this._processQueue(key);
    }
  
    _releaseWriteLock(key) {
      this.writers.delete(key);
  
      this._processQueue(key);
    }
  
    _getQueue(key) {
      if (!this.queues.has(key)) {
        this.queues.set(key, []);
      }
  
      return this.queues.get(key);
    }
  
    _processQueue(key) {
      const queue = this._getQueue(key);
  
      if (queue.length === 0) return;
  
      const nextItem = queue.shift();
  
      if (nextItem.type === 'read') {
        nextItem.resolve(this._acquireReadLock(key));
      } else if (nextItem.type === 'write') {
        nextItem.resolve(this._acquireWriteLock(key));
      }
    }
  }
  
  module.exports = { ThreadSafeResourceManager };