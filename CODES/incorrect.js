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
      const output = this.formatLog('DEBUG', message);
      console.log(output);
      this.logs.push(output);
      return output;
    }
    return '';
  }

  info(message) {
    if (this._shouldLog('INFO')) {
      const output = this.formatLog('INFO', message);
      console.info(output);
      this.logs.push(output);
      return output;
    }
    return '';
  }

  warn(message) {
    if (this._shouldLog('WARN')) {
      const output = this.formatLog('WARN', message);
      console.warn(output);
      this.logs.push(output);
      return output;
    }
    return '';
  }

  error(message) {
    if (this._shouldLog('ERROR')) {
      const output = this.formatLog('ERROR', message);
      console.error(output);
      this.logs.push(output);
      return output;
    }
    return '';
  }

  formatLog(level, message) {
    return `${level} [${this.getTimestamp()}]: ${this.serialize(message)}`;
  }

  serialize(message) {
    return JSON.stringify(message);
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
          const output = this.serialize(message);
          this.logs.push(output);
          resolve(output);
        }
      }, 0);
    });
  }

  isCircular(obj) {
    try {
      JSON.stringify(obj);
      return false;
    } catch (error) {
      return true;
    }
  }

  debug(message) {
    return this.log(message);
  }
}

// Export the logger instance
const logger = new Logger();
module.exports = { logger };