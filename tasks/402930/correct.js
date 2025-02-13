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
              .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
      });
  }

  registerFormatter(name, formatterFn) {
      if (typeof formatterFn !== 'function') {
          throw new Error("an error occurred");
      }
      if (this.formatters.has(name)) {
          throw new Error("an error occurred");
      }
      this.formatters.set(name, formatterFn);
  }

  registerPattern(name, pattern, replacement) {
      if (!(pattern instanceof RegExp)) {
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
      return formatters.reduce((result, formatter) => {
          if (typeof formatter === 'string') {
              return this.format(result, formatter);
          }
          return this.format(result, formatter.name, formatter.options);
      }, text);
  }

  removeFormatting(text, options = {}) {
      if (!text || typeof text !== 'string') {
          throw new Error("an error occurred");
      }

      let result = text;

      // Remove camelCase formatting
      if (options.camel) {
          result = result.replace(/([a-z])([A-Z])/g, '$1 $2')  
                       .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2'); 
      }

      // Remove snake_case formatting
      if (options.snake) {
          result = result.replace(/_/g, ' ');
      }

      // Remove alternating case
      if (options.alternating) {
          result = result.toLowerCase();
      }

      // Remove all case formatting (uppercase/lowercase)
      if (options.case) {
          result = result.toLowerCase();
      }

      // Remove extra spaces
      if (options.spaces) {
          result = result.replace(/\s+/g, ' ').trim();
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

module.exports = {TextFormatter};