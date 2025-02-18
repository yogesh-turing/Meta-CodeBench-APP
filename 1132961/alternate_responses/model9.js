const { Mutex, MutexInterface, TryLock } = require('async-mutex');

class ThreadSafeResourceManager {
  constructor() {
    this.cache = new Map();
    this.locks = new Map();
    this.readLocks = new Map();
    this.writeLocks = new Map();
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
    if (!this.readLocks.has(key)) {
      const mutex = new Mutex();
      this.readLocks.set(key, mutex);
    }
    const mutex = this.readLocks.get(key);
    await mutex.runExclusive(async () => {
      if (this.writeLocks.has(key)) {
        await this._waitForWriteLockRelease(key, timeout);
      }
    });
  }

  async _releaseReadLock(key) {
    if (this.readLocks.has(key)) {
      const mutex = this.readLocks.get(key);
      mutex.release();
    }
  }

  async _acquireWriteLock(key, timeout) {
    if (!this.writeLocks.has(key)) {
      const mutex = new Mutex();
      this.writeLocks.set(key, mutex);
    }
    const mutex = this.writeLocks.get(key);
    await mutex.runExclusive(async () => {
      if (this.readLocks.has(key)) {
        await this._waitForReadLockRelease(key, timeout);
      }
    });
  }

  async _releaseWriteLock(key) {
    if (this.writeLocks.has(key)) {
      const mutex = this.writeLocks.get(key);
      mutex.release();
    }
  }

  async _waitForReadLockRelease(key, timeout) {
    const startTime = Date.now();
    while (this.readLocks.has(key)) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      if (Date.now() - startTime > timeout) {
        throw new Error(`Timeout acquiring write lock for key ${key}`);
      }
    }
  }

  async _waitForWriteLockRelease(key, timeout) {
    const startTime = Date.now();
    while (this.writeLocks.has(key)) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      if (Date.now() - startTime > timeout) {
        throw new Error(`Timeout acquiring read lock for key ${key}`);
      }
    }
  }
}

module.exports = { ThreadSafeResourceManager };