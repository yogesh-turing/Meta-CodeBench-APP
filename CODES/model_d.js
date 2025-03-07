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
      try {
        return JSON.stringify(message);
      } catch (error) {
        if (error instanceof TypeError) {
          throw new Error('Circular structure');
        }
        throw error;
      }
    }
    return String(message);
  }

  isCircular(obj) {
    const seen = new WeakSet();
    
    const detect = (obj) => {
      if (obj && typeof obj === 'object') {
        if (seen.has(obj)) return true;
        seen.add(obj);
        
        return Object.keys(obj).some(key => {
          try {
            return detect(obj[key]);
          } catch (error) {
            return false;
          }
        });
      }
      return false;
    };
    
    return detect(obj);
  }

  async logAsync(message) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (this.isCircular(message)) {
            reject(new Error('Circular structure'));
          } else {
            const output = this.serialize(message);
            this.logs.push(output);
            resolve(output);
          }
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
  }

  clear() {
    this.logs = [];
  }

  getLogs() {
    return this.logs;
  }
}

const logger = new Logger();
module.exports = { logger };