class Logger {
  constructor() {
    this.logs = [];
    // Ordered from lowest priority to highest:
    this.levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    // Default to the lowest-priority level so that everything is logged unless changed:
    this.currentLevel = 'DEBUG';
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  levelPriority(level) {
    // Returns 1-based priority (DEBUG = 1, INFO = 2, WARN = 3, ERROR = 4).
    return this.levels.indexOf(level) + 1;
  }

  setLogLevel(level) {
    if (!this.levels.includes(level)) {
      throw new Error('Invalid log level');
    }
    this.currentLevel = level;
  }

  // The key fix here: if the incoming level's priority is >= currentLevel,
  // then _shouldLog returns true. Previously, it was reversed (<=).
  _shouldLog(level) {
    return this.levelPriority(level) >= this.levelPriority(this.currentLevel);
  }

  // Add the missing debug() method to pass the tests that call logger.debug().
  debug(message) {
    if (this._shouldLog('DEBUG')) {
      const output = `DEBUG [${this.getTimestamp()}]: ${message}`;
      console.debug(output);
      this.logs.push(output);
      return output;
    }
    return '';
  }

  // The generic log() uses console.log() but is effectively debug-level.
  log(message) {
    if (this._shouldLog('DEBUG')) {
      const output = this.serialize(message);
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

  // serialize() should handle objects (including arrays), null, undefined, etc.
  serialize(message) {
    if (message === null) return 'null';
    if (message === undefined) return 'undefined';
    if (typeof message === 'object') {
      return JSON.stringify(message);
    }
    return String(message);
  }

  clear() {
    this.logs = [];
  }

  getLogs() {
    return this.logs;
  }

  // Asynchronous logger returning a Promise
  async logAsync(message) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.isCircular(message)) {
          reject(new Error('Circular structure'));
        } else {
          const output = this.serialize(message) + ' ';
          this.logs.push(output.trim());
          resolve(output.trim());
        }
      }, 0);
    });
  }

  // Correctly detect circular references by tracking visited objects in a WeakSet
  isCircular(value) {
    const seen = new WeakSet();

    function detect(obj) {
      if (obj && typeof obj === 'object') {
        if (seen.has(obj)) return true;
        seen.add(obj);

        // Recursively check all children
        for (const val of Object.values(obj)) {
          if (detect(val)) {
            return true;
          }
        }
      }
      return false;
    }

    return detect(value);
  }
}

// Export the logger instance
const logger = new Logger();
module.exports = { logger };