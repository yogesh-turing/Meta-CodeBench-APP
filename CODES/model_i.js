class Logger {
  constructor() {
    this.logs = [];
    this.levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    this.currentLevel = 'DEBUG';
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  levelPriority(level) {
    return this.levels.indexOf(level);
  }

  setLogLevel(level) {
    if (!this.levels.includes(level)) {
      throw new Error('Invalid log level');
    }
    this.currentLevel = level;
  }

  _shouldLog(level) {
    return this.levelPriority(level) >= this.levelPriority(this.currentLevel);
  }

  log(message) {
    if (this._shouldLog('DEBUG')) {
      const output = `DEBUG [${this.getTimestamp()}]: ${this.serialize(message)}`;
      console.log(output);
      this.logs.push(output);
      return output;
    }
    return '';
  }

  info(message) {
    if (this._shouldLog('INFO')) {
      const output = `INFO [${this.getTimestamp()}]: ${message}`;
      console.info(output);
      this.logs.push(output);
      return output;
    }
    return '';
  }

  warn(message) {
    if (this._shouldLog('WARN')) {
      const output = `WARN [${this.getTimestamp()}]: ${message}`;
      console.warn(output);
      this.logs.push(output);
      return output;
    }
    return '';
  }

  error(message) {
    if (this._shouldLog('ERROR')) {
      const output = `ERROR [${this.getTimestamp()}]: ${message}`;
      console.error(output);
      this.logs.push(output);
      return output;
    }
    return '';
  }

  debug(message) {
    if (this._shouldLog('DEBUG')) {
      const output = `DEBUG [${this.getTimestamp()}]: ${message}`;
      console.debug(output);
      this.logs.push(output);
      return output;
    }
    return '';
  }

  serialize(message) {
    if (message === null) return 'null';
    if (message === undefined) return 'undefined';
    if (typeof message === 'object') {
      try {
        return JSON.stringify(message);
      } catch (e) {
        throw new Error('Serialization failed.');
      }
    }
    return String(message);
  }

  clear() {
    this.logs = [];
  }

  getLogs() {
    return this.logs;
  }

  async logAsync(message) {
    return new Promise((resolve, reject) => {
      if (this.isCircular(message)) {
        reject(new Error('Circular structure'));
        return;
      }
      
      setTimeout(() => {
        try {
          const output = this.serialize(message);
          this.logs.push(output);
          resolve(output);
        } catch (e) {
          reject(e);
        }
      }, 0);
    });
  }

  isCircular(obj) {
    const seenObjects = new WeakSet();

    const detect = (obj) => {
      if (typeof obj !== 'object' || obj === null) {
        return false;
      }

      if (seenObjects.has(obj)) {
        return true;
      }

      seenObjects.add(obj);

      for (let key in obj) {
        if (detect(obj[key])) {
          return true;
        }
      }

      seenObjects.delete(obj);
      return false;
    };

    return detect(obj);
  }
}

// Export the logger instance
const logger = new Logger();
module.exports = { logger };