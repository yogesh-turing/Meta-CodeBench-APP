class ThreadSafeResourceManager {
    constructor() {
      this.cache = new Map();
      this.readLocks = new Map();
      this.writeLocks = new Map();
      this.readQueue = new Map();
      this.writeQueue = new Map();
    }
  
    async addResource(key, resource, timeout = 10000) {
      await this._acquireWriteLock(key, timeout);
      try {
        this.cache.set(key, resource);
      } finally {
        this._releaseWriteLock(key);
      }
    }
  
    async getResource(key, timeout = 10000) {
      await this._acquireReadLock(key, timeout);
      try {
        return this.cache.get(key) || null;
      } finally {
        this._releaseReadLock(key);
      }
    }
  
    async removeResource(key, timeout = 10000) {
      await this._acquireWriteLock(key, timeout);
      try {
        this.cache.delete(key);
      } finally {
        this._releaseWriteLock(key);
      }
    }
  
    async _acquireReadLock(key, timeout) {
      if (this.writeLocks.has(key)) {
        await this._waitForWriteLock(key, timeout);
      }
  
      if (!this.readLocks.has(key)) {
        this.readLocks.set(key, 0);
      }
  
      this.readLocks.set(key, this.readLocks.get(key) + 1);
  
      if (this.writeQueue.has(key)) {
        this.writeQueue.get(key).push(() => this._releaseReadLock(key));
      }
    }
  
    async _acquireWriteLock(key, timeout) {
      if (this.readLocks.has(key) || this.writeLocks.has(key)) {
        await this._waitForReadAndWriteLocks(key, timeout);
      }
  
      this.writeLocks.set(key, true);
  
      if (this.readQueue.has(key)) {
        this.readQueue.get(key).push(() => this._releaseWriteLock(key));
      }
    }
  
    async _waitForWriteLock(key, timeout) {
      let resolve;
      const promise = new Promise((r) => {
        resolve = r;
      });
  
      if (!this.writeQueue.has(key)) {
        this.writeQueue.set(key, []);
      }
  
      this.writeQueue.get(key).push(resolve);
  
      const timer = setTimeout(() => {
        throw new Error(`Timeout acquiring write lock for key ${key}`);
      }, timeout);
  
      await promise;
  
      clearTimeout(timer);
    }
  
    async _waitForReadAndWriteLocks(key, timeout) {
      let resolve;
      const promise = new Promise((r) => {
        resolve = r;
      });
  
      if (!this.readQueue.has(key)) {
        this.readQueue.set(key, []);
      }
  
      this.readQueue.get(key).push(resolve);
  
      const timer = setTimeout(() => {
        throw new Error(`Timeout acquiring read and write locks for key ${key}`);
      }, timeout);
  
      await promise;
  
      clearTimeout(timer);
    }
  
    _releaseReadLock(key) {
      this.readLocks.set(key, this.readLocks.get(key) - 1);
  
      if (this.readLocks.get(key) === 0) {
        this.readLocks.delete(key);
  
        if (this.writeQueue.has(key)) {
          const next = this.writeQueue.get(key).shift();
          next();
        }
      }
    }
  
    _releaseWriteLock(key) {
      this.writeLocks.delete(key);
  
      if (this.readQueue.has(key)) {
        const next = this.readQueue.get(key).shift();
        next();
      }
    }
  }
  
  module.exports = { ThreadSafeResourceManager };