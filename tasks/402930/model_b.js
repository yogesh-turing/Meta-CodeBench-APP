class TextFormatter {
  constructor() {
      this.formatters = new Map();
      this.customPatterns = new Map();
      this.registerDefaultFormatters();
  }

  registerDefaultFormatters() {
      // Basic formatters
      this.formatters.set('uppercase', (text) => text.toUpperCase());
      this.formatters.set('lowercase', (text) => text.toLowerCase());
      this.formatters.set('capitalize', (text) => {
          return text.replace(/\b\w/g, char => char.toUpperCase());
      });

      // Advanced formatters
      this.formatters.set('reverse', (text) => [...text].reverse().join(''));
      this.formatters.set('alternating', (text) => {
          return [...text].map((char, i) => 
              i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
          ).join('');
      });
      this.formatters.set('snake', (text) => 
          text.toLowerCase().replace(/\s+/g, '_')
      );
      this.formatters.set('camel', (text) => {
          return text.toLowerCase()
              .replace(/\s+(.)/g, (_, char) => char.toUpperCase());
      });
  }

  registerFormatter(name, formatterFn) {
      if (!name || typeof name !== 'string' || typeof formatterFn !== 'function' || this.formatters.has(name)) {
          throw new Error("an error occurred");
      }
      this.formatters.set(name, formatterFn);
  }

  registerPattern(name, pattern, replacement) {
      if (!name || !(pattern instanceof RegExp) || !replacement || this.customPatterns.has(name)) {
          throw new Error("an error occurred");
      }
      this.customPatterns.set(name, { pattern, replacement });
  }

  applyPattern(text, patternName) {
      const patternObj = this.customPatterns.get(patternName);
      if (!patternObj) {
          throw new Error("an error occurred");
      }
      return text.replace(patternObj.pattern, patternObj.replacement);
  }

  format(text, formatterName, options = {}) {
      if (!text || typeof text !== 'string') {
          throw new Error("an error occurred");
      }

      const formatter = this.formatters.get(formatterName);
      if (!formatter) {
          throw new Error("an error occurred");
      }

      let result = formatter(text);

      if (options.trim) {
          result = result.trim();
      }

      if (options.pattern) {
          result = this.applyPattern(result, options.pattern);
      }

      if (options.repeat && Number.isInteger(options.repeat) && options.repeat > 0) {
          result = result.repeat(options.repeat);
      }

      return result;
  }

  chainFormat(text, formatters) {
      if (!text || !Array.isArray(formatters)) {
          throw new Error("an error occurred");
      }

      return formatters.reduce((result, formatter) => {
          if (!formatter.name || !this.formatters.has(formatter.name)) {
              throw new Error("an error occurred");
          }
          return this.format(result, formatter.name, formatter.options || {});
      }, text);
  }

  removeFormatting(text, options = {}) {
      if (!text || typeof text !== 'string') {
          throw new Error("an error occurred");
      }

      let result = text;

      if (options.case) {
          result = result.toLowerCase();
      }

      if (options.spaces) {
          result = result.replace(/\s+/g, ' ');
      }

      if (options.snake) {
          result = result.replace(/_/g, ' ');
      }

      if (options.camel) {
          result = result.replace(/([A-Z])/g, ' $1').trim();
          result = result.toLowerCase();
      }

      if (options.alternating) {
          result = result.toLowerCase();
      }

      return result;
  }

  getAvailableFormatters() {
      return Array.from(this.formatters.keys());
  }

  getAvailablePatterns() {
      return Array.from(this.customPatterns.keys());
  }
}

module.exports = { TextFormatter };