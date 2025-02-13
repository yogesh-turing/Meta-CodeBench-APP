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



 

  getAvailableFormatters() {
      return Array.from(this.formatters.keys());
  }

  getAvailablePatterns() {
      return Array.from(this.customPatterns.keys());
  }
}

module.exports = {TextFormatter};