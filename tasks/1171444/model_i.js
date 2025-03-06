class Logger {
  constructor() {
    this.logs = [];
    // Priority: DEBUG=0, INFO=1, WARN=2, ERROR=3
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

  // Changed comparison from <= to >= so that only messages
  // at or above the currentLevel are logged.
  _shouldLog(level) {
    return this.levelPriority(level) >= this.levelPriority(this.currentLevel);
  }

  // Added a debug() method to match the tests’ expectations
  debug(message) {
    if (this._shouldLog('DEBUG')) {
      const output = `DEBUG [${this.getTimestamp()}]: ${message}`;
      console.debug(output);
      this.logs.push(output);
      return output;
    }
    return '';
  }

  // Often “log()” is treated like a DEBUG-level log.
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

  // Fixed isCircular so it actually checks for cycles
  isCircular(obj) {
    const seen = new WeakSet();
    const detect = (value) => {
      if (value && typeof value === 'object') {
        if (seen.has(value)) {
          return true;
        }
        seen.add(value);
        // Recursively check all object values
        return Object.values(value).some(detect);
      }
      return false;
    };
    return detect(obj);
  }
}

// Export the logger instance
const logger = new Logger();
module.exports = { logger };