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
          return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (match, index) => {
              return index === 0 ? match.toLowerCase() : match.toUpperCase();
          }).replace(/\s+/g, '');
      });
  }

  registerFormatter(name, func) {
      if (this.formatters.has(name)) {
          throw new Error("an error occurred");
      }
      this.formatters.set(name, func);
  }

  registerPattern(name, pattern, replacement) {
      if (this.customPatterns.has(name)) {
          throw new Error("an error occurred");
      }
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

  chainFormat(text, formats) {
      if (!text || typeof text !== 'string' || !Array.isArray(formats)) {
          throw new Error("an error occurred");
      }

      let result = text;
      for (const format of formats) {
          result = this.format(result, format.name, format.options);
      }

      return result;
  }

  removeFormatting(text, options) {
      if (!text || typeof text !== 'string' || typeof options !== 'object') {
          throw new Error("an error occurred");
      }

      let result = text;

      if (options.case) {
          if (options.case === 'uppercase') {
              result = result.toLowerCase();
          } else if (options.case === 'lowercase') {
              result = result.toUpperCase();
          } else if (options.case === 'alternating') {
              result = result.toLowerCase();
          }
      }

      if (options.spaces) {
          result = result.replace(/\s+/g, ' ');
      }

      if (options.formatters) {
          for (const formatterName of options.formatters) {
              const formatter = this.formatters.get(formatterName);
              if (formatter) {
                  if (formatterName === 'camel') {
                      result = result.replace(/(\w)([A-Z])/g, '$1 $2');
                  } else if (formatterName === 'snake') {
                      result = result.replace(/_/g, ' ');
                  }
              }
          }
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