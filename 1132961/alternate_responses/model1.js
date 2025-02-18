class ThreadSafeResourceManager {
    constructor(defaultTimeout = 5000) {
      this.cache = new Map();
      this.defaultTimeout = defaultTimeout;
      this.activeReaders = new Set();
      this.activeWriter = null;
      this.writerQueue = [];
      this.readerQueue = [];
    }
  
    async _acquireReadLock(timeout = this.defaultTimeout) {
      const lockPromise = new Promise((resolve, reject) => {
        const request = {
          resolve,
          reject,
          timestamp: Date.now()
        };
  
        if (this.activeWriter || this.writerQueue.length > 0) {
          this.readerQueue.push(request);
        } else {
          this.activeReaders.add(request);
          resolve();
        }
      });
  
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Read lock acquisition timeout')), timeout)
      );
  
      try {
        await Promise.race([lockPromise, timeoutPromise]);
      } catch (error) {
        this.readerQueue = this.readerQueue.filter(req => req.timestamp !== Date.now());
        throw error;
      }
    }
  
    async _acquireWriteLock(timeout = this.defaultTimeout) {
      const lockPromise = new Promise((resolve, reject) => {
        const request = {
          resolve,
          reject,
          timestamp: Date.now()
        };
  
        if (this.activeWriter || this.activeReaders.size > 0) {
          this.writerQueue.push(request);
        } else {
          this.activeWriter = request;
          resolve();
        }
      });
  
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Write lock acquisition timeout')), timeout)
      );
  
      try {
        await Promise.race([lockPromise, timeoutPromise]);
      } catch (error) {
        this.writerQueue = this.writerQueue.filter(req => req.timestamp !== Date.now());
        throw error;
      }
    }
  
    _releaseReadLock() {
      this.activeReaders.delete([...this.activeReaders][0]);
      this._processNextLock();
    }
  
    _releaseWriteLock() {
      this.activeWriter = null;
      this._processNextLock();
    }
  
    _processNextLock() {
      if (this.activeWriter || this.activeReaders.size > 0) return;
  
      if (this.writerQueue.length > 0) {
        const nextWriter = this.writerQueue.shift();
        this.activeWriter = nextWriter;
        nextWriter.resolve();
      } else {
        while (this.readerQueue.length > 0) {
          const nextReader = this.readerQueue.shift();
          this.activeReaders.add(nextReader);
          nextReader.resolve();
        }
      }
    }
  
    async addResource(key, resource, timeout) {
      await this._acquireWriteLock(timeout);
      try {
        if (resource === null) throw new Error('Invalid resource');
        this.cache.set(key, resource);
      } finally {
        this._releaseWriteLock();
      }
    }
  
    async getResource(key, timeout) {
      await this._acquireReadLock(timeout);
      try {
        return this.cache.get(key) || null;
      } finally {
        this._releaseReadLock();
      }
    }
  
    async removeResource(key, timeout) {
      await this._acquireWriteLock(timeout);
      try {
        this.cache.delete(key);
      } finally {
        this._releaseWriteLock();
      }
    }
  
    async updateResource(key, updateFn, timeout) {
      await this._acquireWriteLock(timeout);
      try {
        const currentResource = this.cache.get(key);
        if (!currentResource) throw new Error('Resource not found');
        
        const updatedResource = await updateFn(currentResource);
        if (updatedResource === null) throw new Error('Invalid update result');
        
        this.cache.set(key, updatedResource);
        return updatedResource;
      } finally {
        this._releaseWriteLock();
      }
    }
  
    async clear(timeout) {
      await this._acquireWriteLock(timeout);
      try {
        this.cache.clear();
      } finally {
        this._releaseWriteLock();
      }
    }
  }
  
  module.exports = { ThreadSafeResourceManager };