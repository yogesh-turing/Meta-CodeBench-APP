class Logger {
  constructor() {
    this.logs = [];
    // Keep levels in ascending order of severity:
    //  DEBUG < INFO < WARN < ERROR
    // so that setting WARN only logs WARN and ERROR, for example.
    this.levels = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    this.currentLevel = 'DEBUG';
  }

  // Return an ISO timestamp. In tests, the time may be mocked to a fixed date.
  getTimestamp() {
    return new Date().toISOString();
  }

  // Convert a level string to a numeric priority.
  levelPriority(level) {
    return this.levels.indexOf(level);
  }

  // Change the current log level.
  setLogLevel(level) {
    if (!this.levels.includes(level)) {
      throw new Error('Invalid log level');
    }
    this.currentLevel = level;
  }

  // Adjust so that we only log the same or higher severity than currentLevel.
  _shouldLog(level) {
    // e.g. If current level is WARN (2), only log if levelPriority(level) >= 2
    return this.levelPriority(level) >= this.levelPriority(this.currentLevel);
  }

  // Provided "log" method. Often used for basic debugging, but in your tests
  // there's also a separate debug() method. You can adapt as needed.
  log(message) {
    // This method uses 'DEBUG' internally, so it respects filtering.
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

  // The test suite expects a dedicated debug() method with a specific format
  debug(message) {
    if (this._shouldLog('DEBUG')) {
      const output = `DEBUG [${this.getTimestamp()}]: ${message}`;
      // console.debug can be used in many environments (Node, browser).
      // If the environment doesn’t support console.debug, you might want
      // to replace with console.log or remove console.debug calls.
      console.debug(output);
      this.logs.push(output);
      return output;
    }
    return '';
  }

  // Turn a value into a string for logging.
  serialize(message) {
    if (message === null) return 'null';
    if (message === undefined) return 'undefined';
    if (typeof message === 'object') {
      // Safely convert object to JSON (where possible).
      return JSON.stringify(message);
    }
    return String(message);
  }

  // Remove all logged entries.
  clear() {
    this.logs = [];
  }

  // Retrieve the logged entries so far.
  getLogs() {
    return this.logs;
  }

  // Asynchronous logging that rejects if the object is circular.
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

  // Fix isCircular so it actually detects circular references.
  isCircular(obj) {
    const seenObjects = new WeakSet();

    function detectCycle(value) {
      if (value && typeof value === 'object') {
        if (seenObjects.has(value)) {
          return true;
        }
        seenObjects.add(value);
        // Recursively check all child values
        return Object.values(value).some((child) => detectCycle(child));
      }
      // Primitives/undefined/null are not circular
      return false;
    }

    return detectCycle(obj);
  }
}

// Export the logger instance
const logger = new Logger();
module.exports = { logger };