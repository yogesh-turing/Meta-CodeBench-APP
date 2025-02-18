class ThreadSafeResourceManager {
    constructor() {
      this.cache = new Map();
      this.locks = new Map();
      this.readLocks = new Map();
      this.writeLocks = new Map();
      this.readQueues = new Map();
      this.writeQueues = new Map();
    }
  
    async addResource(key, resource, timeout = 5000) {
      await this._acquireWriteLock(key, timeout);
      try {
        this.cache.set(key, resource);
      } finally {
        this._releaseWriteLock(key);
      }
    }
  
    async getResource(key, timeout = 5000) {
      await this._acquireReadLock(key, timeout);
      try {
        return this.cache.get(key) || null;
      } finally {
        this._releaseReadLock(key);
      }
    }
  
    async removeResource(key, timeout = 5000) {
      await this._acquireWriteLock(key, timeout);
      try {
        this.cache.delete(key);
      } finally {
        this._releaseWriteLock(key);
      }
    }
  
    async _acquireReadLock(key, timeout) {
      if (this.writeLocks.has(key)) {
        await this._enqueueReadLock(key, timeout);
      } else {
        this._acquireReadLockDirectly(key);
      }
    }
  
    async _acquireWriteLock(key, timeout) {
      if (this.readLocks.has(key) || this.writeLocks.has(key)) {
        await this._enqueueWriteLock(key, timeout);
      } else {
        this._acquireWriteLockDirectly(key);
      }
    }
  
    _acquireReadLockDirectly(key) {
      if (!this.readLocks.has(key)) {
        this.readLocks.set(key, 0);
      }
      this.readLocks.set(key, this.readLocks.get(key) + 1);
    }
  
    _acquireWriteLockDirectly(key) {
      this.writeLocks.set(key, true);
    }
  
    async _enqueueReadLock(key, timeout) {
      if (!this.readQueues.has(key)) {
        this.readQueues.set(key, []);
      }
      const readQueue = this.readQueues.get(key);
  
      const lockPromise = new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`Timeout acquiring read lock for key ${key}`));
        }, timeout);
        readQueue.push({ resolve, reject, timeoutId });
      });
  
      await lockPromise;
      this._acquireReadLockDirectly(key);
    }
  
    async _enqueueWriteLock(key, timeout) {
      if (!this.writeQueues.has(key)) {
        this.writeQueues.set(key, []);
      }
      const writeQueue = this.writeQueues.get(key);
  
      const lockPromise = new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`Timeout acquiring write lock for key ${key}`));
        }, timeout);
        writeQueue.push({ resolve, reject, timeoutId });
      });
  
      await lockPromise;
      this._acquireWriteLockDirectly(key);
    }
  
    _releaseReadLock(key) {
      if (this.readLocks.has(key)) {
        this.readLocks.set(key, this.readLocks.get(key) - 1);
        if (this.readLocks.get(key) === 0) {
          this.readLocks.delete(key);
          this._processWriteQueue(key);
        }
      }
    }
  
    _releaseWriteLock(key) {
      if (this.writeLocks.has(key)) {
        this.writeLocks.delete(key);
        this._processReadQueue(key);
        this._processWriteQueue(key);
      }
    }
  
    _processReadQueue(key) {
      if (this.readQueues.has(key) && !this.writeLocks.has(key)) {
        const readQueue = this.readQueues.get(key);
        while (readQueue.length > 0 && !this.writeLocks.has(key)) {
          const { resolve } = readQueue.shift();
          resolve();
        }
      }
    }
  
    _processWriteQueue(key) {
      if (this.writeQueues.has(key) && !this.readLocks.has(key) && !this.writeLocks.has(key)) {
        const writeQueue = this.writeQueues.get(key);
        if (writeQueue.length > 0) {
          const { resolve } = writeQueue.shift();
          resolve();
        }
      }
    }
  }
  
  module.exports = { ThreadSafeResourceManager };