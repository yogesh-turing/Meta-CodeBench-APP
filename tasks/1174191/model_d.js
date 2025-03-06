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
    const index = this.levels.indexOf(level);
    return index === -1 ? 0 : index;
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

  debug(message) {
    if (this._shouldLog('DEBUG')) {
      const output = `DEBUG [${this.getTimestamp()}]: ${message}`;
      console.debug(output);
      this.logs.push(output);
      return output;
    }
    return '';
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

  serialize(message) {
    if (message === null) return 'null';
    if (message === undefined) return 'undefined';
    if (typeof message === 'object') {
      try {
        return JSON.stringify(message);
      } catch (error) {
        return 'Circular structure detected';
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

  isCircular(obj) {
    try {
      JSON.stringify(obj);
      return false;
    } catch (error) {
      return error.message.includes('circular');
    }
  }

  async logAsync(message) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (this.isCircular(message)) {
            reject(new Error('Circular structure'));
            return;
          }
          const output = this.serialize(message);
          this.logs.push(output);
          resolve(output);
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
  }
}

const logger = new Logger();
module.exports = { logger };