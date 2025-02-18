class ThreadSafeResourceManager {
    constructor() {
      this.cache = new Map();
      this.locks = new Map();
    }
  
    async addResource(key, resource) {
      await this._acquireLock(key);
      try {
        this.cache.set(key, resource);
      } finally {
        this._releaseLock(key);
      }
    }
  
    async getResource(key) {
      await this._acquireLock(key);
      try {
        return this.cache.get(key) || null;
      } finally {
        this._releaseLock(key);
      }
    }
  
    async removeResource(key) {
      await this._acquireLock(key);
      try {
        this.cache.delete(key);
      } finally {
        this._releaseLock(key);
      }
    }
  
    async _acquireLock(key) {
      while (this.locks.has(key)) {
        await this.locks.get(key);
      }
  
      let resolveLock;
      const lockPromise = new Promise((resolve) => {
        resolveLock = resolve;
      });
      this.locks.set(key, lockPromise);
  
      return () => {
        resolveLock();
        this.locks.delete(key);
      };
    }
  
    _releaseLock(key) {
      if (this.locks.has(key)) {
        const resolveLock = this.locks.get(key);
        resolveLock();
        this.locks.delete(key);
      }
    }
  }
  
  module.exports = { ThreadSafeResourceManager };